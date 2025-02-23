import type { InlineConfig, ResolvedConfig } from 'vite'
import { getViteConfigFromCli, isViteCliCall } from './isViteCliCall.js'

// TODO/now: move
export function getFullBuildInlineConfig(config: ResolvedConfig): InlineConfig {
  const configFromCli = !isViteCliCall() ? null : getViteConfigFromCli()
  if (config._viteConfigEnhanced) {
    return config._viteConfigEnhanced
  } else {
    return {
      ...configFromCli,
      configFile: configFromCli?.configFile || config.configFile,
      root: config.root,
      build: {
        ...configFromCli?.build
      }
    }
  }
}
