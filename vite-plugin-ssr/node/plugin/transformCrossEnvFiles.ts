import type { Plugin } from 'vite'
import { isSSR_options } from './utils'
import { getExportNames } from './getExportNames'
import { assert } from '../utils'

export { transformCrossEnvFiles }

function transformCrossEnvFiles(): Plugin {
  return {
    name: 'vite-plugin-ssr:transformCrossEnvFiles',
    async transform(src, id, options) {
      const isSSR = isSSR_options(options)

      if (!isCrossEnvFile(id, isSSR)) {
        return
      }

      const exportNames = await getExportNames(src)

      let code
      if (isSSR) {
        assert(id.includes('.page.client.'))
        code = getCodeForServer(exportNames)
      } else {
        assert(id.includes('.page.server.'))
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

function isCrossEnvFile(id: string, isSSR: boolean) {
  if (isSSR) {
    return /\.page\.client\.[a-zA-Z0-9]+$/.test(id)
  } else {
    return /\.page\.server\.[a-zA-Z0-9]+$/.test(id)
  }
}

function getCodeForServer(exportNames: readonly string[]) {
  const code = `export const exportNames = [${exportNames.map((n) => JSON.stringify(n)).join(', ')}];`
  return code
}

function getCodeForClient(exportNames: readonly string[]) {
  const code = `export const hasExport_onBeforeRender = ${exportNames.includes('onBeforeRender') ? 'true' : 'false'};`
  return code
}
