import type { Config } from 'vike/types'

export default {
  meta: {
    prerenderSetOverEffect: {
      env: { config: true },
      global: (value) => typeof value === 'object',
      effect({ configValue }) {
        return {
          prerender: configValue as PrerenderConfig
        }
      }
    }
  }
} satisfies Config

type PrerenderConfig = Config['prerender']
declare global {
  namespace Vike {
    interface Config {
      prerenderSetOverEffect?: PrerenderConfig
    }
  }
}

export {}
