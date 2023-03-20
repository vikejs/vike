export default {
  passToClient: ['pageProps', 'documentProps', 'someAsyncProps'],
  clientRouting: true,
  hydrationCanBeAborted: true,
  prerender: true,
  // WARNING: the naming below *will* change (and improve)
  configDefinitions: {
    documentProps: {
      valueEnv: 'server-and-client'
    },
    onBeforeRenderIsomorphic: {
      valueEnv: 'c_config',
      sideEffect({ configDefinedBy, configValue }: { configValue: unknown; configDefinedBy: string }) {
        if (typeof configValue !== 'boolean') {
          throw new Error(`${configDefinedBy} should be a boolean`)
        }
        if (configValue) {
          return {
            configDefinitions: {
              onBeforeRender: {
                valueEnv: 'server-and-client'
              }
            }
          }
        }
      }
    }
  }
}
