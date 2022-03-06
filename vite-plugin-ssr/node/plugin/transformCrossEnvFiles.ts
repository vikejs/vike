import type { Plugin } from 'vite'
import { isSSR_options } from './utils'
import { getExportNames } from './getExportNames'

export { transformCrossEnvFiles }

function transformCrossEnvFiles(): Plugin {
  return {
    name: 'vite-plugin-ssr:transformCrossEnvFiles',
    async transform(src, id, options) {
      const isSSR = isSSR_options(options)
      if (!isCrossEnvFileType(id, isSSR)) {
        return
      }

      const exportNames = await getExportNames(src)

      let code
      if (isSSR) {
        code = getCodeForServer(exportNames)
      } else {
        code = getCodeForClient(exportNames)
      }
      code = code + '\n'

      return {
        code,
        // Remove Source Map to save KBs
        //  - https://rollupjs.org/guide/en/#source-code-transformations
        map: { mappings: '' },
      }
    },
  } as Plugin
}

function isCrossEnvFileType(id: string, isSSR: boolean) {
  if (isSSR) {
    return /\.page\.client\.[a-zA-Z0-9]+$/.test(id)
  } else {
    return /\.page\.server\.[a-zA-Z0-9]+$/.test(id)
  }
}

function getCodeForClient(exportNames: readonly string[]) {
  const code = `export const hasExport_onBeforeRender = ${exportNames.includes('onBeforeRender') ? 'true' : 'false'};`
  return code
}

function getCodeForServer(exportNames: readonly string[]) {
  const code = `export const exportNames = [${exportNames.map((n) => JSON.stringify(n)).join(', ')}];`
  return code
}
