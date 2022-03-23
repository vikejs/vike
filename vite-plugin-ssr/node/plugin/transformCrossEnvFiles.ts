import type { Plugin } from 'vite'
import { isSSR_options } from './utils'
import { extractStylesRE, getExtractStylesCode } from './extractStylesPlugin'
import { extractExportNamesRE, getExtractExportNamesCode } from './extractExportNamesPlugin'

export { transformCrossEnvFiles }

const clientFileRE = /\.page\.client\.[a-zA-Z0-9]+(\?|$)/
const serverFileRE = /\.page\.server\.[a-zA-Z0-9]+(\?|$)/
const virtualFileRE = /^virtual\:/

function transformCrossEnvFiles(): Plugin {
  return {
    name: 'vite-plugin-ssr:transformCrossEnvFiles',
    enforce: 'post',
    async transform(src, id, options) {
      if (virtualFileRE.test(id) || extractStylesRE.test(id) || extractExportNamesRE.test(id)) {
        return
      }

      const isServerSide = isSSR_options(options)
      const isClientSide = !isServerSide

      if (isServerSide && clientFileRE.test(id)) {
        const code = await getExtractExportNamesCode(src, isClientSide)
        return code
      }

      if (isClientSide && serverFileRE.test(id)) {
        const code = await getExtractStylesCode(src, id)
        return code
      }
    },
  } as Plugin
}
