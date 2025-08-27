import type { Config } from 'vike/types'

export default {
  prerender: {
    enable: null,
    parallel: 4,
    noExtraDir: true,
  },
  someNeverUsedConfig: 'never-used-value',
  meta: {
    prerenderSetOverEffect: {
      env: { config: true },
      effect({ configValue }) {
        return {
          prerender: configValue as boolean,
        }
      },
    },
    // TEST: omit the "unknown config" error without defining the config — useful for optional peer dependencies: for example, vike-server sets +stream.require which is defined by vike-{react,vue,solid} but some users don't use vike-{react,vue,solid}
    someNeverUsedConfig: {
      isDefinedByPeerDependency: true,
    },
  },
  csp: { nonce: true },
} satisfies Config

declare global {
  namespace Vike {
    interface Config {
      /** Showcase of using `meta.effect` https://vike.dev/meta */
      prerenderSetOverEffect?: boolean
      someNeverUsedConfig?: 'never-used-value'
    }
  }
}

export {}
