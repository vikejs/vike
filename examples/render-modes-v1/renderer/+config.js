export default {
  clientRouting: true,
  hydrationCanBeAborted: true,
  // See https://vite-plugin-ssr.com/data-fetching
  passToClient: ['pageProps'],
  includeAssetsImportedByServer: true,
  meta: {
    renderMode: {
      env: 'config-only',
      effect({ configDefinedAt, configValue }) {
        let env
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
}
