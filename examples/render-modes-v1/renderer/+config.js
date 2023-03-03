export default {
  clientRouting: true,
  hydrationCanBeAborted: true,
  // See https://vite-plugin-ssr.com/data-fetching
  passToClient: ['pageProps'],
  includeAssetsImportedByServer: true,
  configDefinitions: {
    renderMode: {
      c_env: 'c_config',
      sideEffect({ configDefinedBy, configValue }) {
        let c_env
        if (configValue == 'HTML') c_env = 'server-only'
        if (configValue == 'SPA') c_env = 'client-only'
        if (configValue == 'SSR') c_env = 'server-and-client'
        // TODO: rename configDefinedBy
        if (!c_env)
          throw new Error(`${configDefinedBy} has an invalid value, make to set its value to 'SSR', 'SPA', or 'HTML'`)
        return {
          configDefinitions: {
            Page: { c_env }
          }
        }
      }
    }
  }
}
