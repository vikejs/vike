// This plugin makes the client-side bundle include CSS imports that live in files loaded only on the server-side. (Needed for HTML-only pages, and React Server Components.)
// We recommend using the debug flag to get an idea of how this plugin works: `$ DEBUG=extractStyles pnpm exec vite build`. Then have a look at `dist/client/manifest.json` and see how `.page.server.js` entries have zero JavaScript but only CSS.

export { extractStylesPlugin }
export { extractStylesRE }
export { extractStylesAddQuery }

import type { Plugin } from 'vite'
import type { ResolvedId } from 'rollup'
import { isSSR_options, assert, getFileExtension, removeSourceMap, assertPosixPath } from '../utils'
import { parseEsModules, EsModules } from '../parseEsModules'
import { extractStylesAddQuery } from './extractStylesPlugin/extractStylesAddQuery'
import { createDebugger, isDebugEnabled } from '../../utils'

const extractStylesRE = /(\?|&)extractStyles(?:&|$)/
const cssLangs = new RegExp(`\\.(css|less|sass|scss|styl|stylus|pcss|postcss)($|\\?)`) // Copied from https://github.com/vitejs/vite/blob/d649daba7682791178b711d9a3e44a6b5d00990c/packages/vite/src/node/plugins/css.ts#L90-L91
const EMPTY_MODULE_ID = 'virtual:vite-plugin-ssr:empty-module'

const debugNamespace = 'vps:extractStyles'
const debug = createDebugger(debugNamespace)
const debugEnabled = isDebugEnabled(debugNamespace)

function extractStylesPlugin(): Plugin[] {
  let root: string
  return [
    // Remove all JS from `.page.server.js` files and `?extractStyles` imports, so that only CSS remains
    {
      name: 'vite-plugin-ssr:extractStyles-1',
      // In dev, things just work. (Because Vite's module graph erroneously conflates the Vite server-side importees with the client-side importees.)
      apply: 'build',
      enforce: 'post',
      async transform(src, id, options) {
        const isServerSide = isSSR_options(options)
        if (!isTransformTarget(id, isServerSide)) {
          return
        }
        assert(!isServerSide)
        const esModules = await parseEsModules(src)
        debug(`source transformed: ${id}`)
        const imports = getImports(esModules)
        const code = imports.join('\n')
        return removeSourceMap(code)
      },
    },
    // Recursively remove all JS. The neat thing about this appraoch is that it supports import path aliases set by `vite.config.js#resolve.alias` https://vitejs.dev/config/#resolve-alias
    {
      name: 'vite-plugin-ssr:extractStyles-2',
      apply: 'build',
      // We ensure this plugin to be run before:
      //  - rollup's `alias` plugin; https://github.com/rollup/plugins/blob/5363f55aa1933b6c650832b08d6a54cb9ea64539/packages/alias/src/index.ts
      //  - Vite's `vite:resolve` plugin; https://github.com/vitejs/vite/blob/d649daba7682791178b711d9a3e44a6b5d00990c/packages/vite/src/node/plugins/resolve.ts#L105
      enforce: 'pre',
      async resolveId(source, importer, options) {
        assert(root)
        if (!importer) {
          // We don't need to transform the ID of the `*.page.server.js` entries
          return
        }
        const isServerSide = isSSR_options(options)
        if (!isTransformTarget(importer, isServerSide)) {
          return
        }
        assert(!isServerSide)

        let resolution: null | ResolvedId = null
        try {
          resolution = await this.resolve(source, importer, { skipSelf: true, ...options })
        } catch {}

        // Sometimes Rollup fails to resolve. If it fails to resolve, we assume the dependency to be an npm package and we skip it. (AFAICT, Rollup should always be able to resolve local dependencies.)
        if (!resolution) return emptyModule(source, importer)

        const { id } = resolution

        // Include CSS(/LESS/SCSS/...) files
        if (cssLangs.test(id)) {
          debugOperation('INCLUDED', id, importer)
          return resolution
        }

        // If the import path is relative, we certainly want to include its CSS dependencies
        // E.g. `import something from './some/relative/path'
        if (source.startsWith('.')) {
          return transformedId(id, importer)
        }

        // If the import path resolves to a file in `node_modules/`, we can ignore that file:
        //  - Direct CSS dependencies are included though, such as `import 'bootstrap/theme/dark.css'`. (Because the above if-branch for CSS files will add the file.)
        //  - Loading CSS from a library (living in `node_modules/`) in an non-directly is non-standard we can safely not support this case. (I'm not aware of any library that does this.)
        assertPosixPath(id)
        if (id.includes('/node_modules/')) {
          return emptyModule(id, importer)
        }
        // When the library is symlinked, it doesn't live in a `node_modules/` directory but lives outside `root`.
        assertPosixPath(root)
        if (!id.startsWith(root)) {
          return emptyModule(id, importer)
        }

        // All the above if-branches are skipped when the import path is an alias.
        // E.g. `import something from './some/relative/path'
        return transformedId(id, importer)
      },
    },
    {
      name: 'vite-plugin-ssr:extractStyles-3',
      apply: 'build',
      configResolved(config) {
        root = config.root
        assert(root)
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

function isTransformTarget(id: string, isServerSide: boolean) {
  if (extractStylesRE.test(id)) {
    assert(!isServerSide)
    return true
  }
  return false
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

function getImports(esModules: EsModules): string[] {
  const [importStatements] = esModules
  if (!importStatements) {
    return []
  }
  const imports: string[] = []
  importStatements.forEach(({ a, n }) => {
    // I don't know why `n` can be `undefined`
    if (n === undefined) return
    const importName = n
    let skipImport = false

    // Remove assertions such as:
    //  - `import json from './json.json' assert { type: 'json' }`
    //  - `import('asdf', { assert: { type: 'json' }})
    if (a !== -1) {
      skipImport = true
    }
    // Remove modifiers such as `import logoUrl from './logo.svg?url'` or `'./logo.svg?raw'`
    if (importName.includes('?')) {
      skipImport = true
    }
    /* We cannot do this because of aliased imports
    if (!importName.startsWith('.')) {
      skipImport = true
    }
    //*/
    // It seems like we need to manually nuke `react`; it seems that what the React runtime `@vitejs/react` injects is not picked up by our `resolveId` hook.
    if (/^react($|\/)/.test(importName)) {
      skipImport = true
    }

    if (!skipImport) {
      imports.push(`import '${importName}';`)
    }

    debug(`import ${skipImport ? 'SKIPPED' : 'INCLUDED'} : ${importName}`)
  })
  return imports
}

function debugOperation(operation: 'NUKED' | 'INCLUDED' | 'TRANSFORMED', id: string, importer: string) {
  debug(`import ${operation}: ${id} (importer: ${importer})`)
}
