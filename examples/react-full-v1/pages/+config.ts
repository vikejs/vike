export default {
  onRenderHtml: './config/onRenderHtml.tsx',
  onRenderClient: './config/onRenderClient.tsx',
  onHydrationEnd: './config/onHydrationEnd.ts',
  onPageTransitionStart: './config/onPageTransitionStart.ts',
  onPageTransitionEnd: './config/onPageTransitionEnd.ts',
  // TODO: make adding documentProps to passToClient obsolete?
  passToClient: ['pageProps', 'documentProps', 'someAsyncProps'],
  clientRouting: true,
  hydrationCanBeAborted: true,
  prerender: true,
  configDefinitions: {
    documentProps: {
      c_env: 'server-and-client'
    },
    onBeforeRenderIsomorphic: {
      c_env: 'c_config',
      sideEffect({ configDefinedBy, configValue }: { configValue: unknown; configDefinedBy: string }) {
        if (typeof configValue !== 'boolean') {
          throw new Error(`${configDefinedBy} should be a boolean`)
        }
        if (configValue) {
          return {
            configDefinitions: {
              onBeforeRender: {
                c_env: 'server-and-client'
              }
            }
          }
        }
      }
    }
  }
}
