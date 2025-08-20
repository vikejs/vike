// Remove this workaround if the other workaround config.build.ssrEmitAssets turns out to be reliable.
//  - Remove this file then revert this commit: https://github.com/vikejs/vike/commit/805a18974f13420a78fcc30fdd676696e405c3ca

// Workaround to make client-side bundles include the CSS imports living in server-side-only code.
//  - This is needed for HTML-only pages, and React Server Components.
//  - We recommend using the debug flag to get an idea of how this plugin works: `$ DEBUG=vike:pluginExtractAssets pnpm exec vike build`. Then have a look at `dist/client/manifest.json` and see how `.page.server.js` entries have zero JavaScript but only CSS.
//  - This approach supports import path aliases `vite.config.js#resolve.alias` https://vitejs.dev/config/#resolve-alias

export { pluginExtractAssets }
export { extractAssetsRE }

import type { Plugin, ResolvedConfig } from 'vite'
import {
  assert,
  assertPosixPath,
  styleFileRE,
  createDebugger,
  isScriptFile,
  assertUsage,
  rollupSourceMapRemove,
  addVirtualFileIdPrefix,
  isVirtualFileId,
  removeVirtualFileIdPrefix,
} from '../utils.js'
import { extractAssetsAddQuery } from '../../shared/extractAssetsQuery.js'
import { isAsset } from '../shared/isAsset.js'
import { getImportStatements, type ImportStatement } from '../shared/parseEsModule.js'
import type { Rollup } from 'vite'
import pc from '@brillout/picocolors'
import { handleAssetsManifest_isFixEnabled } from './pluginBuild/handleAssetsManifest.js'
import { getVikeConfigInternal, type VikeConfigInternal } from '../shared/resolveVikeConfigInternal.js'
import { assertV1Design } from '../../shared/assertV1Design.js'
import { normalizeId } from '../shared/normalizeId.js'
import { isViteServerBuild_transform } from '../shared/isViteServerBuild.js'
import { resolveIncludeAssetsImportedByServer } from '../../runtime/renderPage/getPageAssets/retrievePageAssetsProd.js'
type ResolvedId = Rollup.ResolvedId

const extractAssetsRE = /(\?|&)extractAssets(?:&|$)/
const rawRE = /(\?|&)raw(?:&|$)/
const urlRE = /(\?|&)url(?:&|$)/
const EMPTY_MODULE_ID = 'virtual:vike:empty-module'

const debug = createDebugger('vike:pluginExtractAssets')

function pluginExtractAssets(): Plugin[] {
  let config: ResolvedConfig
  let vikeConfig: VikeConfigInternal
  let isFixEnabled: boolean
  return [
    // This plugin removes all JavaScript from server-side only code, so that only CSS imports remains. (And also static files imports e.g. `import logoURL from './logo.svg.js'`).
    {
      name: 'vike:pluginExtractAssets:remove-javaScript',
      // In dev, things just work. (Because Vite's module graph erroneously conflates the Vite server-side importees with the client-side importees.)
      apply: 'build',
      enforce: 'post',
      async transform(src, id, options) {
        id = normalizeId(id)
        if (!extractAssetsRE.test(id)) {
          return
        }
        if (isFixEnabled) {
          // I'm guessing isFixEnabled can only be true when mixing both designs: https://github.com/vikejs/vike/issues/1480
          assertV1Design(vikeConfig._pageConfigs, true)
          assert(false)
        }
        const includeAssetsImportedByServer = resolveIncludeAssetsImportedByServer(vikeConfig.config)
        assert(includeAssetsImportedByServer)
        assert(!isViteServerBuild_transform(config, options, this.environment))
        const importStatements = await getImportStatements(src)
        const moduleNames = getImportedModules(importStatements)
        const code = moduleNames.map((moduleName) => `import '${moduleName}';`).join('\n')
        debugTransformResult(id, code, importStatements)
        return rollupSourceMapRemove(code)
      },
    },
    // This plugin appends `?extractAssets` to module IDs
    {
      name: 'vike:pluginExtractAssets:append-extractAssets-query',
      apply: 'build',
      // We ensure this plugin to be run before:
      //  - rollup's `alias` plugin; https://github.com/rollup/plugins/blob/5363f55aa1933b6c650832b08d6a54cb9ea64539/packages/alias/src/index.ts
      //  - Vite's `vite:resolve` plugin; https://github.com/vitejs/vite/blob/d649daba7682791178b711d9a3e44a6b5d00990c/packages/vite/src/node/plugins/resolve.ts#L105
      enforce: 'pre',
      async resolveId(source, importer, options) {
        if (isViteServerBuild_transform(config, options, this.environment)) {
          // When building for the server, there should never be a `?extractAssets` query
          assert(!extractAssetsRE.test(source))
          assert(importer === undefined || !extractAssetsRE.test(importer))
          return
        }

        // If there is no `importer` then `module` is an entry.
        // We don't need to append `?extractAssets` to entries because they already have `?extractAssets` as Vike appends `?extractAssets` to entries by using `import.meta.glob('/**/*.page.server.js', { as: "extractAssets" })` (see `generateImportGlobs.ts`).
        if (!importer) {
          return
        }

        // We only append `?extractAssets` if the parent module has `?extractAssets`
        if (!extractAssetsRE.test(importer)) {
          return
        }
        const includeAssetsImportedByServer = resolveIncludeAssetsImportedByServer(vikeConfig.config)
        assert(includeAssetsImportedByServer)

        let resolution: null | ResolvedId = null
        try {
          resolution = await this.resolve(source, importer, { skipSelf: true, ...options })
        } catch {}

        // Sometimes Rollup fails to resolve. If it fails to resolve, we assume the dependency to be an npm package and we skip it. (I guess Rollup should always be able to resolve local dependencies?)
        if (!resolution) return emptyModule(source, importer)

        const { id: file, external } = resolution

        // Nothing is externalized when building for the client-side
        assert(external === false)

        // We include:
        //  - CSS(/LESS/SCSS/...) files
        //  - Asset files (`.svg`, `.pdf`, ...)
        //  - URL imports (e.g. `import scriptUrl from './script.js?url.js'`)
        if (styleFileRE.test(file) || isAsset(file) || urlRE.test(file)) {
          debugOperation('INCLUDED', file, importer)
          return resolution
        }

        // We erase `source` if its file doesn't contain JavaScript
        if (!isScriptFile(file)) {
          return emptyModule(file, importer)
        }

        // If the import path resolves to a file in `node_modules/`, we ignore that file:
        //  - Direct CSS dependencies are included though, such as `import 'bootstrap/theme/dark.css'`. (Because the above if-branch for CSS files will add the file.)
        //  - Loading CSS from a library (living in `node_modules/`) in a non-direct way is unconventional; we can safely not support this case. (I'm not aware of any library that does this.)
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
      },
    },
    {
      name: 'vike:pluginExtractAssets-3',
      apply: 'build',
      load(id) {
        if (!isVirtualFileId(id)) return undefined
        id = removeVirtualFileIdPrefix(id)

        if (id === EMPTY_MODULE_ID) {
          return '// Erased by vike:pluginExtractAssets'
        }
      },
      config() {
        if (debug.isActivated) {
          return { logLevel: 'silent' }
        }
      },
    },
    {
      name: 'vike:pluginExtractAssets-4',
      async configResolved(config_) {
        config = config_
        vikeConfig = await getVikeConfigInternal()
        isFixEnabled = handleAssetsManifest_isFixEnabled(config)
        if (!isFixEnabled) {
          // https://github.com/vikejs/vike/issues/1060
          assertUsage(
            !config.plugins.find((p) => p.name === 'vite-tsconfig-paths'),
            'vite-tsconfig-paths not supported, remove it and use vite.config.js#resolve.alias instead',
          )
        }
      },
    },
  ]
}

function emptyModule(file: string, importer: string) {
  debugOperation('NUKED', file, importer)
  return addVirtualFileIdPrefix(EMPTY_MODULE_ID)
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
  //  - `import json from './json.json' assert { type: 'json.js' }`
  //  - `import('asdf', { assert: { type: 'json' }})
  if (assertion !== -1) {
    return { moduleName, skip: true }
  }

  // Add imports such as `import logoUrl from './logo.svg?url.js'`
  if (urlRE.test(moduleName)) {
    return { moduleName, skip: false }
  }

  // Remove imports such as `import logoUrl from './logo.svg?raw.js'`
  if (rawRE.test(moduleName)) {
    return { moduleName, skip: true }
  }

  /* We shouldn't do this because of aliased imports
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
  const importStatementsStr = stringifyImportStatements(importStatements)
    .map((s) => pc.cyan(s))
    .join(', ')
  debug(`source TRANSFORMED: ${id} (CODE: ${pc.cyan(code.split('\n').join(' '))}, IMPORTS: ${importStatementsStr})`)
}
