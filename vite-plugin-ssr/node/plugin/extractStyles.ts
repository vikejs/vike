export { extractStylesPlugin }
export { getExtractStylesImports }

import type { Plugin } from 'vite'
import { parseEsModules, EsModules } from './parseEsModules'
import { isSSR_options, assert, getFileExtension } from './utils'

const extractStylesRE = /(\?|&)extractStyles(?:&|$)/
// Copied from `vite/packages/vite/src/node/plugins/css.ts`
const cssLangs = new RegExp(`\\.(css|less|sass|scss|styl|stylus|pcss|postcss)($|\\?)`)

function extractStylesPlugin(): Plugin {
  return {
    name: 'vite-plugin-ssr:extractStyles',
    enforce: 'post',
    async transform(src, id, options) {
      if (extractStylesRE.test(id)) {
        assert(!isSSR_options(options))
        const esModules = await parseEsModules(src)
        const extractStylesImports = getExtractStylesImports(esModules)
        return extractStylesImports.join('\n')
      }
    },
  } as Plugin
}

function getExtractStylesImports(esModules: EsModules) {
  return getAndTransformImportStatements(esModules, (idImportee) => {
    idImportee = `${idImportee}?extractStyles`
    const fileExtension = getFileExtension(idImportee)
    if (fileExtension) {
      idImportee = `${idImportee}&lang.${fileExtension}`
    }
    return idImportee
  })
}

function getAndTransformImportStatements(
  esModules: EsModules,
  makeExtractStylesImport: (idImportee: string) => string,
): string[] {
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
        // Remove modifiers such as `import logoUrl from './logo.svg?url'`
        n &&
        !n?.includes('?') &&
        // Only include file imports, i.e. remove:
        // - Dependencies
        // - Virtual modules
        (n.startsWith('./') || n.startsWith('../')),
    )
    .forEach(({ n }) => {
      assert(n)
      const idImportee = n
      if (cssLangs.test(idImportee)) {
        importStatments.push(`import '${idImportee}';`)
      } else {
        importStatments.push(`import '${makeExtractStylesImport(idImportee)}';`)
      }
    })
  return importStatments
}
