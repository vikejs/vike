import type { Plugin } from 'vite'
import { isSSR_options, assert } from './utils'
import { parseEsModules, getExportNames } from './parseEsModules'
import { getExtractStylesImports } from './extractStyles'

export { transformCrossEnvFiles }

const metaRE = /(\?|&)meta(?:&|$)/
const clientFileRE = /\.page\.client\.[a-zA-Z0-9]+(\?|$)/
const serverFileRE = /\.page\.server\.[a-zA-Z0-9]+(\?|$)/
const isomphFileRe = /\.page\.[a-zA-Z0-9]+(\?|$)/

function transformCrossEnvFiles(): Plugin {
  return {
    name: 'vite-plugin-ssr:transformCrossEnvFiles',
    enforce: 'post',
    async transform(src, id, options) {
      const isSSR = isSSR_options(options)

      if (metaRE.test(id)) {
        const esModules = await parseEsModules(src)

        if (!isSSR && (clientFileRE.test(id) || isomphFileRe.test(id))) {
          let code = ''

          const extractStylesImports = getExtractStylesImports(esModules)
          code += extractStylesImports.join('\n')

          const exportNames = getExportNames(esModules)
          code += '\n'
          code += [
            `export const hasExport_Page = ${exportNames.includes('Page') ? 'true' : 'false'};`,
            `export const hasExport_default = ${exportNames.includes('default') ? 'true' : 'false'};`,
            `export const hasExport_clientRouter = ${exportNames.includes('clientRouter') ? 'true' : 'false'};`,
            // `export const hasExport_overrideDefaults = ${exportNames.includes('overrideDefaults') ? 'true' : 'false'};`,
          ].join('\n')

          code += '\n'
          return removeSourceMap(code)
        }
        assert(false, { id, isSSR })
      }

      if (isSSR && clientFileRE.test(id)) {
        const esModules = await parseEsModules(src)
        const exportNames = getExportNames(esModules)
        let code = `export const exportNames = [${exportNames.map((n) => JSON.stringify(n)).join(', ')}];`
        code += '\n'
        return removeSourceMap(code)
      }

      if (!isSSR && serverFileRE.test(id)) {
        const esModules = await parseEsModules(src)
        const exportNames = getExportNames(esModules)
        const code = [
          `export const hasExport_onBeforeRender = ${exportNames.includes('onBeforeRender') ? 'true' : 'false'};`,
          '',
        ].join('\n')
        return removeSourceMap(code)
      }
    },
  } as Plugin
}

function removeSourceMap(code: string) {
  return {
    code,
    // Remove Source Map to save KBs
    //  - https://rollupjs.org/guide/en/#source-code-transformations
    map: { mappings: '' },
  }
}
