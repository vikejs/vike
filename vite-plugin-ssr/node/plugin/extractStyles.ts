export { extractStylesPlugin }
export { getExtractStylesImports }

import type { Plugin } from 'vite'
import { parseEsModules, EsModules } from './parseEsModules'
import { isSSR_options, assert, slice } from './utils'

const extractStylesRE = /(\?|&)extractStyles(?:&|$)/

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
    const fileExtension = slice(idImportee.split('.'), -1, 0)
    return `${idImportee}?extractStyles&lang.${fileExtension}`
  })
}

function getAndTransformImportStatements(
  esModules: EsModules,
  transformId: (idImportee: string) => string,
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
        n?.includes('?'),
    )
    .forEach(({ n }) => {
      assert(n)
      const idImportee = n
      importStatments.push(`import '${transformId(idImportee)}';`)
    })
  return importStatments
}
