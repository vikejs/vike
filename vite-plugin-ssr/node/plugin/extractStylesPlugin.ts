export { extractStylesPlugin }
export { extractStylesRE }

// This plugin makes the client-side bundle include CSS imports that live in files loaded only on the server-side. (Needed for HTML-only pages, and React Server Components.)

import type { Plugin } from 'vite'
import { parseEsModules, EsModules } from './parseEsModules'
import { isSSR_options, assert, getFileExtension, removeSourceMap, assertPosixPath } from './utils'
import { virtualFileRE } from './virtualPageFilesMeta'

const extractStylesRE = /(\?|&)extractStyles(?:&|$)/
// Copied from https://github.com/vitejs/vite/blob/d649daba7682791178b711d9a3e44a6b5d00990c/packages/vite/src/node/plugins/css.ts#L90-L91
const cssLangs = new RegExp(`\\.(css|less|sass|scss|styl|stylus|pcss|postcss)($|\\?)`)
const serverPageFileRE = /\.page\.server\.[a-zA-Z0-9]+$/
const EMPTY_MODULE_ID = 'virtual:vite-plugin-ssr:empty-module'

const isMatch = (id: string) => !virtualFileRE.test(id) && (serverPageFileRE.test(id) || extractStylesRE.test(id))

function extractStylesPlugin(): Plugin {
  let root: string
  return {
    name: 'vite-plugin-ssr:extractStyles',
    // In dev, things just work. (Because Vite's module graph erroneously conflates the Vite server-side importees with the client-side importees.)
    apply: 'build',
    // We ensure this plugin to be run before:
    //  - rollup's `alias` plugin; https://github.com/rollup/plugins/blob/5363f55aa1933b6c650832b08d6a54cb9ea64539/packages/alias/src/index.ts
    //  - Vite's `vite:resolve` plugin; https://github.com/vitejs/vite/blob/d649daba7682791178b711d9a3e44a6b5d00990c/packages/vite/src/node/plugins/resolve.ts#L105
    enforce: 'pre',
    async resolveId(source, importer, options) {
      assert(root)
      if (!importer || !isMatch(importer)) {
        return
      }
      const isSSR = isSSR_options(options)
      if (isSSR) {
        return
      }
      const resolution = await this.resolve(source, importer, { skipSelf: true, ...options })

      // If it cannot be resolved, just return it so that Rollup can display an error.
      if (!resolution) return resolution

      const { id } = resolution

      // Include CSS(/LESS/SCSS/...) files
      if (cssLangs.test(id)) {
        debug('INCLUDED', id, importer)
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
    async transform(src, id, options) {
      if (!isMatch(id)) {
        return
      }
      const isSSR = isSSR_options(options)
      if (isSSR) {
        return
      }
      const code = await extractImports(src)
      return code
    },
    configResolved(config) {
      root = config.root
      assert(root)
    },
    load(id) {
      if (id === EMPTY_MODULE_ID) {
        return '// Erased by `vite-plugin-ssr:extractStyles`.'
      }
    },
  } as Plugin
}

function emptyModule(id: string, importer: string) {
  debug('NUKED', id, importer)
  return EMPTY_MODULE_ID
}
function transformedId(id: string, importer: string) {
  const fileExtension = getFileExtension(id)
  if (!fileExtension) {
    debug('NUKED', id, importer)
    return EMPTY_MODULE_ID
  }
  debug('TRANSFORMED', id, importer)
  return `${id}?extractStyles&lang.${fileExtension}`
}

async function extractImports(src: string) {
  const esModules = await parseEsModules(src)
  const extractStylesImports = getAndTransformImportStatements(esModules)
  const code = extractStylesImports.join('\n')
  return removeSourceMap(code)
}

function getAndTransformImportStatements(esModules: EsModules): string[] {
  const [imports] = esModules
  if (!imports) {
    return []
  }
  const importStatments: string[] = []
  imports
    .filter(
      ({ a, n }) =>
        // Remove assertions such as:
        //  - `import json from './json.json' assert { type: 'json' }`
        //  - `import('asdf', { assert: { type: 'json' }})
        a === -1 &&
        // Remove modifiers such as `import logoUrl from './logo.svg?url'` or `'./logo.svg?raw'`.
        n &&
        !n?.includes('?'),
    )
    .forEach(({ n }) => {
      assert(n)
      const idImportee = n
      importStatments.push(`import '${idImportee}';`)
    })
  return importStatments
}

/*/
const DEBUG = true
/*/
const DEBUG = false
//*/
function debug(operation: 'NUKED' | 'INCLUDED' | 'TRANSFORMED', id: string, importer: string) {
  if (!DEBUG) {
    return
  }
  console.log('')
  console.log(operation)
  console.log('id: ' + id)
  console.log('importer: ' + importer)
}
