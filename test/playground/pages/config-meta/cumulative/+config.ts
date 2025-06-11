import { Config } from 'vike/types'

export default {
  settingStandard: { nested: 'default for standard @ /cumulative' },
  settingCumulative: { nested: 'default for cumulative @ /cumulative' },
  meta: {
    // Used for testing different merge behaviors
    settingStandard: {
      env: { server: true, client: true, config: true },
      cumulative: false,
    },
    settingCumulative: {
      env: { server: true, client: true, config: true },
      cumulative: true,
    },
  },
} satisfies Config
