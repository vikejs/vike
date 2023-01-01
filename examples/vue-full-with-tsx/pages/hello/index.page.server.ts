import type { PageContextBuiltIn } from 'vite-plugin-ssr'

export { onBeforeRender }
export { prerender }

const names = ['evan', 'rom', 'alice', 'jon', 'eli']

async function onBeforeRender(pageContext: PageContextBuiltIn) {
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
