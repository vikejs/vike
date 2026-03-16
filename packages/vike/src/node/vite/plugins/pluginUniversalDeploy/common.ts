import type { Plugin } from 'vite'
import '../../assertEnvVite.js'

export const pluginCommon = {
  applyToEnvironment(env) {
    return env.config.consumer === 'server'
  },
  sharedDuringBuild: true,
} satisfies Partial<Plugin>
