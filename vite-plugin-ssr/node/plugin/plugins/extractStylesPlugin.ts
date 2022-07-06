// This plugin makes the client-side bundle include CSS imports that live in files loaded only on the server-side. (Needed for HTML-only pages, and React Server Components.)
// We recommend using the debug flag to get an idea of how this plugin works: `$ DEBUG=vps:extractStyles pnpm exec vite build`. Then have a look at `dist/client/manifest.json` and see how `.page.server.js` entries have zero JavaScript but only CSS.
// This appraoch supports import path aliases set by `vite.config.js#resolve.alias` https://vitejs.dev/config/#resolve-alias

export { extractStylesPlugin }
export { extractStylesRE }

import type { Plugin, ResolvedConfig } from 'vite'
import type { ResolvedId } from 'rollup'
import {
  isSSR_options,
  assert,
  removeSourceMap,
  assertPosixPath,
  isJavascriptFile,
  isAsset,
  getImportStatements,
  ImportStatement,
} from '../utils'
import { extractStylesAddQuery } from './extractStylesPlugin/extractStylesAddQuery'
import { createDebugger, isDebugEnabled } from '../../utils'
import { assertViteConfig } from './config/assertConfig'
import type { ConfigVps } from './config'
import { extractExportNamesRE } from './extractExportNamesPlugin'

const extractStylesRE = /(\?|&)extractStyles(?:&|$)/
const cssLangs = new RegExp(`\\.(css|less|sass|scss|styl|stylus|pcss|postcss)($|\\?)`) // Copied from https://github.com/vitejs/vite/blob/d649daba7682791178b711d9a3e44a6b5d00990c/packages/vite/src/node/plugins/css.ts#L90-L91
const EMPTY_MODULE_ID = 'virtual:vite-plugin-ssr:empty-module'

const debugNamespace = 'vps:extractStyles'
const debug = createDebugger(debugNamespace)
const debugEnabled = isDebugEnabled(debugNamespace)

function extractStylesPlugin(): Plugin[] {
  let config: ResolvedConfig & ConfigVps
  return [
    // Remove all JS from `.page.server.js` files and `?extractStyles` imports, so that only CSS remains
    {
      name: 'vite-plugin-ssr:extractStyles-1',
      // In dev, things just work. (Because Vite's module graph erroneously conflates the Vite server-side importees with the client-side importees.)
      apply: 'build',
      enforce: 'post',
      async transform(src, id, options) {
        if (!extractStylesRE.test(id)) {
          return
        }
        assert(!isSSR_options(options))
        const imports = await getImportStatements(src)
        debug(`source transformed: ${id}`)
        const moduleNames = getImportedModules(imports)
        const code = moduleNames.map((moduleName) => `import '${moduleName}';`).join('\n')
        return removeSourceMap(code)
      },
    },
    {
      name: 'vite-plugin-ssr:extractStyles-2',
      apply: 'build',
      // We ensure this plugin to be run before:
      //  - rollup's `alias` plugin; https://github.com/rollup/plugins/blob/5363f55aa1933b6c650832b08d6a54cb9ea64539/packages/alias/src/index.ts
      //  - Vite's `vite:resolve` plugin; https://github.com/vitejs/vite/blob/d649daba7682791178b711d9a3e44a6b5d00990c/packages/vite/src/node/plugins/resolve.ts#L105
      enforce: 'pre',
      async resolveId(source, importer, options) {
        if (isSSR_options(options)) {
          // When building for the server, there should never be a `?extractStyles` query
          assert(!extractStylesRE.test(source))
          assert(importer === undefined || !extractStylesRE.test(importer))
          return
        }
        if (!importer) {
          return
        }
        if (source.includes('.page.server.')) {
          // The first `?extractStyles` queries are appended to `.page.sever.js` files by `vite-plugin-glob`
          assert(extractStylesRE.test(source) || extractExportNamesRE.test(source))
          assert(importer === 'virtual:vite-plugin-ssr:pageFiles:client')
        } else {
          // All other `?extractStyles` queries are appended when this `resolveId()` hook returns `appendExtractStylesQuery()`
          assert(!extractStylesRE.test(source), { source })
        }

        if (!extractStylesRE.test(importer)) {
          return
        }

        let resolution: null | ResolvedId = null
        try {
          resolution = await this.resolve(source, importer, { skipSelf: true, ...options })
        } catch {}

        // Sometimes Rollup fails to resolve. If it fails to resolve, we assume the dependency to be an npm package and we skip it. (I guess Rollup should always be able to resolve local dependencies?)
        if (!resolution) return emptyModule(source, importer)

        const { id: file, external } = resolution

        // Nothing is externalized when building for the client-side
        assert(external === false)

        // Include:
        //  - CSS(/LESS/SCSS/...) files
        //  - Asset files (`.svg`, `.pdf`, ...)
        if (cssLangs.test(file) || isAsset(file)) {
          debugOperation('INCLUDED', file, importer)
          return resolution
        }

        // If the resolved file doesn't end with a JavaScript file extension, we remove it.
        if (!isJavascriptFile(file)) {
          return emptyModule(file, importer)
        }

        // If the dependency is in `vite.config.js#config.vitePluginSsr.includeCSS`, then include its CSS
        if (
          (config.vitePluginSsr.includeCSS || []).some(
            /* Should also work:
            (dependency) =>
              source === dependency ||
              source.startsWith(dependency + '/') ||
              // Include relative imports. (This only works for dependencies because user may use import path aliases.)
              source.startsWith('.'),
            /*/
            (dependency) =>
              file.includes('node_modules/' + dependency + '/') || file.includes('node_modules\\' + dependency + '\\'),
            //*/
          )
        ) {
          return appendExtractStylesQuery(file, importer)
        }

        // If the import path resolves to a file in `node_modules/`, we ignore that file:
        //  - Direct CSS dependencies are included though, such as `import 'bootstrap/theme/dark.css'`. (Because the above if-branch for CSS files will add the file.)
        //  - Loading CSS from a library (living in `node_modules/`) in a non-direct way is non-standard; we can safely not support this case. (I'm not aware of any library that does this.)
        assertPosixPath(file)
        if (file.includes('/node_modules/')) {
          return emptyModule(file, importer)
        }
        // When a library is symlinked, it lives outside `root`.
        assertPosixPath(config.root)
        if (!file.startsWith(config.root)) {
          return emptyModule(file, importer)
        }

        return appendExtractStylesQuery(file, importer)
      },
    },
    {
      name: 'vite-plugin-ssr:extractStyles-3',
      apply: 'build',
      configResolved(config_) {
        assertViteConfig(config_)
        config = config_
      },
      load(id) {
        if (id === EMPTY_MODULE_ID) {
          return '// Erased by `vite-plugin-ssr:extractStyles`.'
        }
      },
      config() {
        if (debugEnabled) {
          return { logLevel: 'silent' }
        }
      },
    },
  ] as Plugin[]
}

function emptyModule(file: string, importer: string) {
  debugOperation('NUKED', file, importer)
  return EMPTY_MODULE_ID
}
function appendExtractStylesQuery(file: string, importer: string) {
  debugOperation('TRANSFORMED', file, importer)
  return extractStylesAddQuery(file)
}

function getImportedModules(importStatements: ImportStatement[]): string[] {
  const moduleNames: string[] = importStatements
    .map(analyzeImport)
    .filter(({ moduleName, skip }) => {
      debug(`import ${skip ? 'SKIPPED' : 'INCLUDED'} : ${moduleName}`)
      return !skip
    })
    .map(({ moduleName }) => {
      assert(moduleName)
      return moduleName
    })
  return moduleNames
}

function analyzeImport(importStatement: ImportStatement): { moduleName: string | null; skip: boolean } {
  const { a: assertion, n } = importStatement

  // `n` is `undefined` for dynamic imports with variable, e.g. `import(moduleName)`
  if (n === undefined) return { moduleName: null, skip: true }
  const moduleName = n

  // Remove assertions such as:
  //  - `import json from './json.json' assert { type: 'json' }`
  //  - `import('asdf', { assert: { type: 'json' }})
  if (assertion !== -1) {
    return { moduleName, skip: true }
  }

  // Remove modifiers such as `import logoUrl from './logo.svg?url'` or `'./logo.svg?raw'`
  if (moduleName.includes('?')) {
    return { moduleName, skip: true }
  }

  /* We should not do this because of aliased imports
  if (!moduleName.startsWith('.')) {
    return { moduleName, skip: true }
  }
  */

  // It seems like we need to manually nuke `react`; it seems that what the React runtime `@vitejs/react` injects is not picked up by our `resolveId` hook.
  if (/^react($|\/)/.test(moduleName)) {
    return { moduleName, skip: true }
  }

  return { moduleName, skip: false }
}

function debugOperation(operation: 'NUKED' | 'INCLUDED' | 'TRANSFORMED', id: string, importer: string) {
  debug(`import ${operation}: ${id} (importer: ${importer})`)
}
