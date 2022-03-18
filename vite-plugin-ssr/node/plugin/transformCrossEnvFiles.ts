import type { Plugin } from 'vite'
import { isSSR_options, assert } from './utils'
import { parseEsModules, getExportNames } from './parseEsModules'
import { getExtractStylesImports } from './extractStyles'

export { transformCrossEnvFiles }

const metaRE = /(\?|&)meta(?:&|$)/
const clientFileRE = /\.page\.client\.[a-zA-Z0-9]+(\?|$)/
const serverFileRE = /\.page\.server\.[a-zA-Z0-9]+(\?|$)/
const isomphFileRE = /\.page\.[a-zA-Z0-9]+(\?|$)/
const virtualFileRE = /^virtual\:/

function transformCrossEnvFiles(): Plugin {
  return {
    name: 'vite-plugin-ssr:transformCrossEnvFiles',
    enforce: 'post',
    async transform(src, id, options) {
      if (virtualFileRE.test(id)) {
        return
      }

      const isServerSide = isSSR_options(options)
      const isClientSide = !isServerSide

      if (metaRE.test(id)) {
        const esModules = await parseEsModules(src)
        const exportNames = getExportNames(esModules)

        if (isClientSide && (clientFileRE.test(id) || isomphFileRE.test(id))) {
          const code = [
            `export const hasExport_Page = ${exportNames.includes('Page') ? 'true' : 'false'};`,
            `export const hasExport_default = ${exportNames.includes('default') ? 'true' : 'false'};`,
            `export const hasExport_clientRouter = ${exportNames.includes('clientRouter') ? 'true' : 'false'};`,
            `export const hasExport_render = ${exportNames.includes('render') ? 'true' : 'false'};`,
            // `export const hasExport_overrideDefaults = ${exportNames.includes('overrideDefaults') ? 'true' : 'false'};`,
            '',
          ].join('\n')
          return removeSourceMap(code)
        }

        if (isClientSide && serverFileRE.test(id)) {
          let code = ''
          code = `export const hasExport_onBeforeRender = ${exportNames.includes('onBeforeRender') ? 'true' : 'false'};`
          code += '\n'
          return removeSourceMap(code)
        }

        assert(false, { id, isClientSide })
      }

      if (isServerSide && clientFileRE.test(id)) {
        const esModules = await parseEsModules(src)
        const exportNames = getExportNames(esModules)
        let code = `export const exportNames = [${exportNames.map((n) => JSON.stringify(n)).join(', ')}];`
        code += '\n'
        return removeSourceMap(code)
      }

      if (isClientSide && serverFileRE.test(id)) {
        const esModules = await parseEsModules(src)
        const extractStylesImports = getExtractStylesImports(esModules, id)
        let code = extractStylesImports.join('\n')
        code += '\n'
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
