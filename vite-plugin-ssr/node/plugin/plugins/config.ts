export { setVitePluginSsrConfig }
export type { VpsConfig } from './config/assertConfig'

import type { Plugin } from 'vite'
import { assertAndMergeUserInput } from './config/assertConfig'

function setVitePluginSsrConfig(vpsConfig: unknown) {
  return {
    name: 'vite-plugin-ssr:setVitePluginSsrConfig',
    enforce: 'pre',
    config(config) {
      const vitePluginSsr = assertAndMergeUserInput(vpsConfig ?? {}, (config as any).vitePluginSsr as unknown ?? {})
      return { vitePluginSsr }
    },
  } as Plugin
}
