export default {
  onRenderHtml: './+config/onRenderHtml.tsx',
  onRenderClient: './+config/onRenderClient.tsx',
  // TODO: make adding documentProps to passToClient obsolete?
  passToClient: ['pageProps', 'documentProps', 'someAsyncProps'],
  clientRouting: true,
  hydrationCanBeAborted: true,
  configDefinitions: {
    documentProps: {
      c_env: 'server-and-client'
    }
  }
}
