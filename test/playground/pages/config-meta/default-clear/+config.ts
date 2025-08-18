import type { Config } from 'vike/types'

export default {
  meta: {
    // Custom cumulative setting used for testing .default and .clear suffix behavior
    settingCumulativeString: {
      env: { server: true, client: true, config: true },
      cumulative: true,
    },
  },
} satisfies Config
