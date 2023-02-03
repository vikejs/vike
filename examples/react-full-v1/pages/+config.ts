export default {
  onRenderHtml: './+config/onRenderHtml.tsx',
  onRenderClient: './+config/onRenderClient.tsx',
  passToClient: ['pageProps', 'documentProps', 'someAsyncProps'],
  clientRouting: true,
  // hydrationCanBeAborted: true // TODO
}
