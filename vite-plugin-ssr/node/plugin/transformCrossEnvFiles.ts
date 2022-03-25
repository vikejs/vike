import type { Plugin } from 'vite'
import { isSSR_options } from './utils'
import { extractStylesRE} from './extractStylesPlugin'
import { extractExportNamesRE, getExtractExportNamesCode } from './extractExportNamesPlugin'
import { virtualFileRE } from './virtualPageFilesMeta'

export { transformCrossEnvFiles }

const clientFileRE = /\.page\.client\.[a-zA-Z0-9]+(\?|$)/

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
    },
  } as Plugin
}
