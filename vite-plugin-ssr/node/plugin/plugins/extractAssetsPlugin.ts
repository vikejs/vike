// This plugin makes the client-side bundle include CSS imports that live in files loaded only on the server-side. (Needed for HTML-only pages, and React Server Components.)
// We recommend using the debug flag to get an idea of how this plugin works: `$ DEBUG=vps:extractAssets pnpm exec vite build`. Then have a look at `dist/client/manifest.json` and see how `.page.server.js` entries have zero JavaScript but only CSS.
// This appraoch supports import path aliases set by `vite.config.js#resolve.alias` https://vitejs.dev/config/#resolve-alias

export { extractAssetsPlugin }
export { extractAssetsRE }

import type { Plugin, ResolvedConfig } from 'vite'
import type { ResolvedId } from 'rollup'
import {
  viteIsSSR_options,
  assert,
  assertPosixPath,
  isAsset,
  styleFileRE,
  createDebugger,
  isDebugEnabled,
  isScriptFile
} from '../utils'
import { removeSourceMap, getImportStatements, ImportStatement } from '../helpers'
import { extractAssetsAddQuery } from './extractAssetsPlugin/extractAssetsAddQuery'
import { getConfigVps } from './config/assertConfigVps'
import type { ConfigVpsResolved } from './config/ConfigVps'
import { extractExportNamesRE } from './extractExportNamesPlugin'
import {
  virtualModuleIdPageFilesClientSR,
  virtualModuleIdPageFilesClientCR
} from './generateImportGlobs/virtualModuleIdPageFiles'

const extractAssetsRE = /(\?|&)extractAssets(?:&|$)/
const rawRE = /(\?|&)raw(?:&|$)/
const urlRE = /(\?|&)url(?:&|$)/
const EMPTY_MODULE_ID = 'virtual:vite-plugin-ssr:empty-module'

const debugNamespace = 'vps:extractAssets'
const debug = createDebugger(debugNamespace)
const debugEnabled = isDebugEnabled(debugNamespace)

function extractAssetsPlugin(): Plugin[] {
  let config: ResolvedConfig
  let configVps: ConfigVpsResolved
  return [
    // Remove all JS from `.page.server.js` files and `?extractAssets` imports, so that only CSS remains
    {
      name: 'vite-plugin-ssr:extractAssets-1',
      // In dev, things just work. (Because Vite's module graph erroneously conflates the Vite server-side importees with the client-side importees.)
      apply: 'build',
      enforce: 'post',
      async transform(src, id, options) {
        if (!extractAssetsRE.test(id)) {
          return
        }
        assert(configVps.includeAssetsImportedByServer)
        assert(!viteIsSSR_options(options))
        const importStatements = await getImportStatements(src)
        const moduleNames = getImportedModules(importStatements)
        const code = moduleNames.map((moduleName) => `import '${moduleName}';`).join('\n')
        debugTransformResult(id, code, importStatements)
        return removeSourceMap(code)
      }
    },
    {
      name: 'vite-plugin-ssr:extractAssets-2',
      apply: 'build',
      // We ensure this plugin to be run before:
      //  - rollup's `alias` plugin; https://github.com/rollup/plugins/blob/5363f55aa1933b6c650832b08d6a54cb9ea64539/packages/alias/src/index.ts
      //  - Vite's `vite:resolve` plugin; https://github.com/vitejs/vite/blob/d649daba7682791178b711d9a3e44a6b5d00990c/packages/vite/src/node/plugins/resolve.ts#L105
      enforce: 'pre',
      async resolveId(source, importer, options) {
        if (viteIsSSR_options(options)) {
          // When building for the server, there should never be a `?extractAssets` query
          assert(!extractAssetsRE.test(source))
          assert(importer === undefined || !extractAssetsRE.test(importer))
          return
        }

        // We don't need to consider the entry modules
        if (!importer) {
          return
        }

        if (!extractAssetsRE.test(importer)) {
          return
        }
        assert(configVps.includeAssetsImportedByServer)

        if (source.includes('.page.server.')) {
          // For a Vue SFC `.page.server.vue`:
          //  - source: `.page.server.vue?vue&type=script&setup=true&lang.ts`
          //  - importer: `.page.server.vue?extractAssets&lang.vue`
          const isVueSFC = source.includes('?vue&')
          // The first `?extractAssets` queries are appended to `.page.sever.js` files by `import.meta.glob()`
          assert(extractAssetsRE.test(source) || extractExportNamesRE.test(source) || isVueSFC, { source, importer })
          assert(
            importer === virtualModuleIdPageFilesClientSR || importer === virtualModuleIdPageFilesClientCR || isVueSFC
          )
        } else {
          // All other `?extractAssets` queries are appended when this `resolveId()` hook returns `appendExtractAssetsQuery()`
          assert(!extractAssetsRE.test(source), { source })
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
        //  - URL imports (e.g. `import scriptUrl from './script.js?url'`)
        if (styleFileRE.test(file) || isAsset(file) || urlRE.test(file)) {
          debugOperation('INCLUDED', file, importer)
          return resolution
        }

        // If the resolved file doesn't end with a JavaScript file extension, we remove it.
        if (!isScriptFile(file)) {
          return emptyModule(file, importer)
        }

        // If the dependency is in `configVps.includeCSS`, then include its CSS
        if (
          configVps.includeCSS.some((depName) => {
            const check1 =
              source === depName ||
              source.startsWith(depName + '/') ||
              // Include relative imports within modules of `depName`. (This only works for dependencies: user may use import path aliases.)
              source.startsWith('.')
            // This doesn't work for linked dependencies
            const check2 =
              file.includes('node_modules/' + depName + '/') || file.includes('node_modules\\' + depName + '\\')
            if (check1) {
              return true
            }
            assert(!check2)
            return false
          })
        ) {
          return appendExtractAssetsQuery(file, importer)
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

        return appendExtractAssetsQuery(file, importer)
      }
    },
    {
      name: 'vite-plugin-ssr:extractAssets-3',
      apply: 'build',
      async configResolved(config_) {
        configVps = await getConfigVps(config_)
        config = config_
      },
      load(id) {
        if (id === EMPTY_MODULE_ID) {
          return '// Erased by `vite-plugin-ssr:extractAssets`.'
        }
      },
      config() {
        if (debugEnabled) {
          return { logLevel: 'silent' }
        }
      }
    }
  ] as Plugin[]
}

function emptyModule(file: string, importer: string) {
  debugOperation('NUKED', file, importer)
  return EMPTY_MODULE_ID
}
function appendExtractAssetsQuery(file: string, importer: string) {
  debugOperation('TRANSFORMED', file, importer)
  return extractAssetsAddQuery(file)
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

  // Add imports such as `import logoUrl from './logo.svg?url'`
  if (urlRE.test(moduleName)) {
    return { moduleName, skip: false }
  }

  // Remove imports such as `import logoUrl from './logo.svg?raw'`
  if (rawRE.test(moduleName)) {
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

function stringifyImportStatements(importStatements: ImportStatement[]) {
  const importsStr: string[] = importStatements.map((importStatement) => {
    const { a: assertion, n } = importStatement

    // `n` is `undefined` for dynamic imports with variable, e.g. `import(moduleName)`
    if (n === undefined) return 'import(...)'

    let importStr = `import '${n}'`

    if (assertion !== -1) {
      importStr += ' assert { ... }'
    }

    return importStr
  })
  return importsStr
}

function debugTransformResult(id: string, code: string, importStatements: ImportStatement[]) {
  debug(
    `source TRANSFORMED: ${id} (CODE: \`${code.split('\n').join(' ')}\`, IMPORTS: ${stringifyImportStatements(
      importStatements
    )
      .map((s) => `\`${s}\``)
      .join(', ')})`
  )
}
