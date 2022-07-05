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
  getFileExtension,
  removeSourceMap,
  assertPosixPath,
  getImportStatements,
  ImportStatement,
} from '../utils'
import { extractStylesAddQuery } from './extractStylesPlugin/extractStylesAddQuery'
import { createDebugger, isDebugEnabled } from '../../utils'
import { assertViteConfig } from './config/assertConfig'
import type { ConfigVps } from './config'

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
        if (!importer) {
          // We don't need to transform the ID of the `*.page.server.js` entries
          return
        }
        if (!extractStylesRE.test(importer)) {
          return
        }
        assert(!isSSR_options(options))

        let resolution: null | ResolvedId = null
        try {
          resolution = await this.resolve(source, importer, { skipSelf: true, ...options })
        } catch {}

        // Sometimes Rollup fails to resolve. If it fails to resolve, we assume the dependency to be an npm package and we skip it. (AFAICT, Rollup should always be able to resolve local dependencies.)
        if (!resolution) return emptyModule(source, importer)

        const { id } = resolution

        // Include:
        //  - CSS(/LESS/SCSS/...) files
        if (cssLangs.test(id)) {
          debugOperation('INCLUDED', id, importer)
          return resolution
        }

        // If the import path is relative, we certainly want to include its CSS dependencies
        // E.g. `import something from './some/relative/path'
        if (source.startsWith('.')) {
          return transformedId(id, importer)
        }

        // If a dependency is in `vite.config.js#config.vitePluginSsr.includeCSS`, then include its CSS
        if (
          (config.vitePluginSsr.includeCSS || []).some(
            (dependency) => source === dependency || source.startsWith(dependency + '/'),
          )
        ) {
          return transformedId(id, importer)
        }

        // If the import path resolves to a file in `node_modules/`, we ignore that file:
        //  - Direct CSS dependencies are included though, such as `import 'bootstrap/theme/dark.css'`. (Because the above if-branch for CSS files will add the file.)
        //  - Loading CSS from a library (living in `node_modules/`) in a non-direct way is non-standard; we can safely not support this case. (I'm not aware of any library that does this.)
        assertPosixPath(id)
        if (id.includes('/node_modules/')) {
          return emptyModule(id, importer)
        }
        // When a library is symlinked, it lives outside `root`.
        assertPosixPath(config.root)
        if (!id.startsWith(config.root)) {
          return emptyModule(id, importer)
        }

        // If the import path is an alias (e.g. `import '@app/some/relative/path'`) then all the above if-branches are skipped. We include it.
        return transformedId(id, importer)
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
    /* Not needed since there are no `?extractStyles` modules in dev
    {
      name: 'vite-plugin-ssr:extractStyles-3',
      apply: applyDev,
      enforce: 'pre',
      handleHotUpdate({ modules }) {
        // Remove `?extractStyles` modules from HMR context
        return modules.filter(({ id }) => !id || !extractStylesRE.test(id))
      },
    },
    */
  ] as Plugin[]
}

function emptyModule(id: string, importer: string) {
  debugOperation('NUKED', id, importer)
  return EMPTY_MODULE_ID
}
function transformedId(id: string, importer: string) {
  const fileExtension = getFileExtension(id)
  if (!fileExtension) {
    return emptyModule(id, importer)
  }
  debugOperation('TRANSFORMED', id, importer)
  return extractStylesAddQuery(id)
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
