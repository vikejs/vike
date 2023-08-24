import type { PageContextBuiltInServer } from 'vite-plugin-ssr/types'
import { names } from './names'

export { onBeforeRender }
export { prerender }

async function onBeforeRender(pageContext: PageContextBuiltInServer) {
  const { name } = pageContext.routeParams
  const pageProps = { name }
  return {
    pageContext: {
      pageProps
    }
  }
}

function prerender(): string[] {
  return ['/hello', ...names.map((name) => `/hello/${name}`)]
}
