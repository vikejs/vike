export default {
  clientRouting: true,
  hydrationCanBeAborted: true,
  // See https://vite-plugin-ssr.com/data-fetching
  passToClient: ['pageProps'],
  includeAssetsImportedByServer: true,
  configDefinitions: {
    renderMode: {
      valueEnv: 'c_config',
      sideEffect({ configDefinedBy, configValue }) {
        let valueEnv
        if (configValue == 'HTML') valueEnv = 'server-only'
        if (configValue == 'SPA') valueEnv = 'client-only'
        if (configValue == 'SSR') valueEnv = 'server-and-client'
        // TODO: rename configDefinedBy
        if (!valueEnv)
          throw new Error(`${configDefinedBy} has an invalid value, make to set its value to 'SSR', 'SPA', or 'HTML'`)
        return {
          configDefinitions: {
            Page: { valueEnv }
          }
        }
      }
    }
  }
}
