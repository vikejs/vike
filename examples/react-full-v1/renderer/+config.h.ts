import type { Config } from 'vike/types'

// https://vike.dev/config
export default {
  timeouts: {
    onBeforeRender: {
      error: 30 * 1000,
      warning: 10 * 1000
    }
  },
  passToClient: ['pageProps', 'title', 'someAsyncProps'],
  clientRouting: true,
  hydrationCanBeAborted: true,
  // https://vike.dev/meta
  meta: {
    // Create new config 'title'
    title: {
      env: { server: true, client: true }
    },
    // Create new config 'onBeforeRenderIsomorph'
    onBeforeRenderIsomorph: {
      env: { config: true },
      effect({ configDefinedAt, configValue }) {
        if (typeof configValue !== 'boolean') {
          throw new Error(`${configDefinedAt} should be a boolean`)
        }
        if (configValue) {
          return {
            meta: {
              onBeforeRender: {
                // We override Vike's default behavior of always loading/executing onBeforeRender() on the server-side.
                // If we set onBeforeRenderIsomorph to true, then onBeforeRender() is loaded/executed in the browser as well, allowing us to fetch data direcly from the browser upon client-side navigation (without involving our Node.js/Edge server at all).
                env: { server: true, client: true }
              }
            }
          }
        }
      }
    }
  }
} satisfies Config
