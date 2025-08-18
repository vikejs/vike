import type { Config } from 'vike/types'

export default {
  meta: {
    settingCumulative: {
      env: { server: true, client: true, config: true },
      cumulative: true,
    },
  },
} satisfies Config
