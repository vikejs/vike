import type { Plugin } from 'vite'
import { isSSR_options, assert } from './utils'
import { getExportNames } from './getExportNames'

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
        if (!isSSR && (clientFileRE.test(id) || isomphFileRe.test(id))) {
          return await transform(src, (exportNames) =>
            [
              `export const hasExport_Page = ${exportNames.includes('Page') ? 'true' : 'false'};`,
              `export const hasExport_default = ${exportNames.includes('default') ? 'true' : 'false'};`,
              `export const hasExport_clientRouter = ${exportNames.includes('clientRouter') ? 'true' : 'false'};`,
              /*
              `export const hasExport_overrideDefaults = ${
                exportNames.includes('overrideDefaults') ? 'true' : 'false'
              };`,
              */
            ].join('\n'),
          )
        }
        assert(false, { id, isSSR })
      }

      if (isSSR && clientFileRE.test(id)) {
        return await transform(
          src,
          (exportNames) => `export const exportNames = [${exportNames.map((n) => JSON.stringify(n)).join(', ')}];`,
        )
      }

      if (!isSSR && serverFileRE.test(id)) {
        return await transform(
          src,
          (exportNames) =>
            `export const hasExport_onBeforeRender = ${exportNames.includes('onBeforeRender') ? 'true' : 'false'};`,
        )
      }
    },
  } as Plugin
}

async function transform(src: string, transformer: (exportNames: readonly string[]) => string) {
  const exportNames = await getExportNames(src)
  const code = transformer(exportNames) + '\n'
  return {
    code,
    // Remove Source Map to save KBs
    //  - https://rollupjs.org/guide/en/#source-code-transformations
    map: { mappings: '' },
  }
}
