export { setVitePluginSsrConfig }

import type { Plugin } from 'vite'
import type { ConfigVpsUserProvided } from './config/ConfigVps'
import { resolveConfigVps } from './config/resolveConfigVps'

function setVitePluginSsrConfig(vpsConfig: unknown) {
  return {
    name: 'vite-plugin-ssr:setVitePluginSsrConfig',
    enforce: 'pre',
    config(config) {
      const vitePluginSsr = resolveConfigVps(
        (vpsConfig ?? {}) as ConfigVpsUserProvided,
        ((config as Record<string, unknown>).vitePluginSsr ?? {}) as ConfigVpsUserProvided
      )
      return { vitePluginSsr }
    }
  } as Plugin
}
