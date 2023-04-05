export default onBeforeRender

import type { PageContextBuiltIn } from 'vite-plugin-ssr/types'

async function onBeforeRender(pageContext: PageContextBuiltIn) {
  const { name } = pageContext.routeParams
  const pageProps = { name }
  return {
    pageContext: {
      pageProps
    }
  }
}
