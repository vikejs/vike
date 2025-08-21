import type { Config } from 'vike/types'

export default {
  meta: {
    // Custom cumulative setting used for testing .default.js and .clear.js suffix behavior
    settingCumulativeString: {
      env: { server: true, client: true, config: true },
      cumulative: true,
    },
  },
} satisfies Config

declare global {
  namespace Vike {
    interface Config {
      // For default/clear tests
      settingCumulativeString?: string
    }
    interface ConfigResolved {
      settingCumulativeString?: string[]
    }
  }
}
