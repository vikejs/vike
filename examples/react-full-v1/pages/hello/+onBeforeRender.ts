export default onBeforeRender

import type { PageContextBuiltIn } from 'vite-plugin-ssr/types'
import { RenderErrorPage } from 'vite-plugin-ssr/RenderErrorPage'

import { names } from './names'

async function onBeforeRender(pageContext: PageContextBuiltIn) {
  const { name } = pageContext.routeParams
  if (name !== 'anonymous' && !names.includes(name)) {
    const errorInfo = `Unknown name: ${name}.`
    throw RenderErrorPage({ pageContext: { pageProps: { errorInfo } } })
  }
  const pageProps = { name }
  return {
    pageContext: {
      pageProps
    }
  }
}
