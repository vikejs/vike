import type { Config, ConfigEnv } from 'vike/types'

// https://vike.dev/config
export default {
  clientRouting: true,
  hydrationCanBeAborted: true,
  passToClient: ['pageProps'],
  // https://vike.dev/meta
  meta: {
    renderMode: {
      env: { config: true },
      effect({ configDefinedAt, configValue }) {
        let env: ConfigEnv | undefined
        if (configValue == 'HTML') env = { server: true }
        if (configValue == 'SPA') env = { client: true }
        if (configValue == 'SSR') env = { server: true, client: true }
        if (!env) throw new Error(`${configDefinedAt} should be 'SSR', 'SPA', or 'HTML'`)
        return {
          meta: {
            Page: { env },
          },
        }
      },
    },
  },
} satisfies Config
