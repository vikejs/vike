export default {
  clientRouting: true,
  hydrationCanBeAborted: true,
  // See https://vite-plugin-ssr.com/data-fetching
  passToClient: ['pageProps'],
  includeAssetsImportedByServer: true,
  defineConfig: {
    renderMode: {
      valueEnv: 'c_config',
      sideEffect({ configDefinedBy, configValue }) {
        let PageEnv
        if (configValue == 'HTML') PageEnv = 'server-only'
        if (configValue == 'SPA') PageEnv = 'client-only'
        if (configValue == 'SSR') PageEnv = 'server-and-client'
        // TODO: rename configDefinedBy
        if (!PageEnv)
          throw new Error(`${configDefinedBy} has an invalid value, make to set its value to 'SSR', 'SPA', or 'HTML'`)
        return {
          defineConfig: {
            Page: {
              valueEnv: PageEnv
            }
          }
        }
      }
    }
  }
}
