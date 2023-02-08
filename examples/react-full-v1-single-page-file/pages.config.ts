export default {
  onRenderHtml: './renderer/onRenderHtml.tsx',
  onRenderClient: './renderer/onRenderClient.tsx',
  onHydrationEnd: './renderer/onHydrationEnd.ts',
  onPageTransitionStart: './renderer/onPageTransitionStart.ts',
  onPageTransitionEnd: './renderer/onPageTransitionEnd.ts',
  // TODO: make adding documentProps to passToClient obsolete?
  passToClient: ['pageProps', 'documentProps', 'someAsyncProps'],
  clientRouting: true,
  hydrationCanBeAborted: true,
  configDefinitions: {
    documentProps: {
      c_env: 'server-and-client'
    }
  },
  errorPage: './renderer/ErrorPage.tsx',
  pages: [
    {
      Page: './pages/star-wars/@id/Page.tsx',
      onBeforeRender: './pages/star-wars/@id/onBeforeRender.ts',
      configDefinitions: {
        onBeforeRender: {
          c_env: 'server-and-client'
        }
      }
    },
    {
      Page: './pages/star-wars/index/Page.tsx',
      onBeforeRender: './pages/star-wars/index/onBeforeRender.ts',
      onPrerender: './pages/star-wars/index/onPrerender.ts'
    },
    {
      Page: './pages/markdown/Page.mdx',
      documentProps: {
        title: 'Some Markdown Page'
      }
    },
    {
      Page: './pages/index/Page.tsx'
    },
    {
      Page: './pages/hello/Page.tsx',
      route: './pages/hello/route.ts',
      onBeforeRender: './pages/hello/onBeforeRender.ts',
      onPrerender: './pages/hello/onPrerender.ts'
    }
  ]
}
