import type { Config, ConfigEnv } from 'vike/types'

// https://vike.dev/config
export default {
  clientRouting: true,
  hydrationCanBeAborted: true,
  passToClient: ['pageProps'],
  // https://vike.dev/meta
  meta: {
    renderMode: {
      env: 'config-only',
      effect({ configDefinedAt, configValue }) {
        let env: ConfigEnv | undefined
        if (configValue == 'HTML') env = 'server-only'
        if (configValue == 'SPA') env = 'client-only'
        if (configValue == 'SSR') env = 'server-and-client'
        if (!env) throw new Error(`${configDefinedAt} should be 'SSR', 'SPA', or 'HTML'`)
        return {
          meta: {
            Page: { env }
          }
        }
      }
    }
  }
} satisfies Config
