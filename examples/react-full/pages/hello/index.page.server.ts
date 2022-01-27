import type { PageContextBuiltIn } from 'vite-plugin-ssr'
import { RenderErrorPage } from 'vite-plugin-ssr'

export { onBeforeRender }
export { prerender }

const names = ['evan', 'rom', 'alice', 'jon', 'eli']

async function onBeforeRender(pageContext: PageContextBuiltIn) {
  const { name } = pageContext.routeParams
  if (name !== 'anonymous' && !names.includes(name)) {
    const errorInfo = `Unknown name: ${name}.`
    throw RenderErrorPage({ pageContext: { pageProps: { errorInfo } } })
  }
  const pageProps = { name }
  return {
    pageContext: {
      pageProps,
    },
  }
}

function prerender() {
  const urls = names.map((name) => `/hello/${name}`)
  return urls
}
