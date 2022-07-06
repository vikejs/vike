export { setVitePluginSsrConfig }

import type { Plugin } from 'vite'
import { resolveConfigVps } from './config/resolveConfigVps'

function setVitePluginSsrConfig(vpsConfig: unknown) {
  return {
    name: 'vite-plugin-ssr:setVitePluginSsrConfig',
    enforce: 'pre',
    config(config) {
      const vitePluginSsr = resolveConfigVps(vpsConfig ?? {}, ((config as any).vitePluginSsr as unknown) ?? {})
      return { vitePluginSsr }
    },
  } as Plugin
}
