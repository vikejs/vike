import type { Plugin } from 'vite'

export const pluginCommon = {
  applyToEnvironment(env) {
    return env.config.consumer === 'server'
  },
  sharedDuringBuild: true,
} satisfies Partial<Plugin>
