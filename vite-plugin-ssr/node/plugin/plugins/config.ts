export { setVitePluginSsrConfig }
export type { VpsConfig } from './config/VpsConfig'

import type { Plugin } from 'vite'
import { resolveVpsConfig } from './config/resolveVpsConfig'

function setVitePluginSsrConfig(vpsConfig: unknown) {
  return {
    name: 'vite-plugin-ssr:setVitePluginSsrConfig',
    enforce: 'pre',
    config(config) {
      const vitePluginSsr = resolveVpsConfig(vpsConfig ?? {}, ((config as any).vitePluginSsr as unknown) ?? {})
      return { vitePluginSsr }
    },
  } as Plugin
}
