export default onBeforeRender

import type { PageContextBuiltInServer } from 'vite-plugin-ssr/types'

async function onBeforeRender(pageContext: PageContextBuiltInServer) {
  const { name } = pageContext.routeParams
  const pageProps = { name }
  return {
    pageContext: {
      pageProps
    }
  }
}
