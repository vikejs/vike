import type { Config } from 'vike/types'

export default {
  meta: {
    prerenderSetOverEffect: {
      env: { config: true },
      effect({ configValue }) {
        return {
          prerender: configValue as boolean
        }
      }
    }
  }
} satisfies Config

declare global {
  namespace Vike {
    interface Config {
      /** Showcase of using `meta.effect` https://vike.dev/meta */
      prerenderSetOverEffect?: boolean
    }
  }
}

export {}
