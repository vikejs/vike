export default {
  passToClient: ['pageProps', 'documentProps', 'someAsyncProps'],
  clientRouting: true,
  hydrationCanBeAborted: true,
  prerender: true,
  meta: {
    documentProps: {
      env: 'server-and-client'
    },
    // We create a custom config 'onBeforeRenderIsomorphic'
    onBeforeRenderIsomorphic: {
      env: 'config-only',
      effect({ configDefinedAt, configValue }: { configValue: unknown; configDefinedAt: string }) {
        if (typeof configValue !== 'boolean') {
          throw new Error(`${configDefinedAt} should be a boolean`)
        }
        if (configValue) {
          return {
            meta: {
              onBeforeRender: {
                // We override VPS's default behavior of always executing onBeforeRender() on the server-side.
                // In other words: we can set our custom config onBeforeRenderIsomorphic to `true` in order to fetch data direcly from the browser (without involving our Node.js/Edge server at all).
                env: 'server-and-client'
              }
            }
          }
        }
      }
    }
  }
}
