import type { Config, ConfigEffect } from 'vike/types'

const x: Config | null = null

export default {
  settingServerOnly: { nested: 'serverOnly @ /env' },
  settingClientOnly: { nested: 'clientOnly @ /env' },
  settingConfigOnly: { nested: 'configOnly @ /env' },
  meta: {
    settingServerOnly: {
      env: { server: true },
    },
    settingClientOnly: {
      env: { client: true },
    },
    settingConfigOnly: {
      env: { config: true },
    },
  },
} satisfies Config
