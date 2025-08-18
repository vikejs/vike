import type { Config } from 'vike/types'

export default {
  meta: {
    settingCumulativeString: {
      env: { server: true, client: true, config: true },
      cumulative: true,
    },
  },
} satisfies Config
