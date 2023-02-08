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
  configDefinitions: {
    documentProps: {
      c_env: 'server-and-client',
      c_code: false
    }
  }
  /* TODO
  pages: [
    {
      isErrorPage: true,
      Page: './config/ErrorPage.tsx'
    }
  ]
  */
}
