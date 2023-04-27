import type { Config, Env } from 'vite-plugin-ssr/types'

// https://vite-plugin-ssr.com/config
export default {
  clientRouting: true,
  hydrationCanBeAborted: true,
  passToClient: ['pageProps'],
  // https://vite-plugin-ssr.com/meta
  meta: {
    renderMode: {
      env: 'config-only',
      effect({ configDefinedAt, configValue }) {
        let env: Env | undefined
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
