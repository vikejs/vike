export { setVitePluginSsrConfig }
export type { VpsConfig } from './config/assertViteConfig'

import type { Plugin } from 'vite'
import { assertAndMergeUserInput } from './config/assertViteConfig'

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
