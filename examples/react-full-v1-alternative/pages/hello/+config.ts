export default {
  route,
  onBeforePrerenderStart,
  onBeforeRender: () => import('./onBeforeRender').then((m) => m.default)
}

async function route(pageContext: { urlPathname: string }) {
  const { resolveRoute } = await import('vite-plugin-ssr/routing')
  if (pageContext.urlPathname === '/hello' || pageContext.urlPathname === '/hello/') {
    const name = 'anonymous'
    return { routeParams: { name } }
  }
  return resolveRoute('/hello/@name', pageContext.urlPathname)
}

async function onBeforePrerenderStart() {
  const { names } = await import('./names')
  return ['/hello', ...names.map((name) => `/hello/${name}`)]
}
