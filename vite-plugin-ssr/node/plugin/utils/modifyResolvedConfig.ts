export { modifyResolvedConfig }
export type { ResolvedConfigModifications }

import { ResolvedConfig } from 'vite'

type ResolvedConfigModifications = {
  build?: {
    rollupOptions?: { input?: Record<string, string> }
  }
}
function modifyResolvedConfig(config: ResolvedConfig, configMod: ResolvedConfigModifications) {
  if (configMod.build?.rollupOptions) {
    Object.assign(config.build.rollupOptions, configMod.build.rollupOptions)
  }
}
