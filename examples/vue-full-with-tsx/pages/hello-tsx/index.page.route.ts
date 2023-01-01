import { resolveRoute } from 'vite-plugin-ssr/routing'

// We use a Route Function to implement advanced routing logic
export default (pageContext: { urlPathname: string }) => {
  if (pageContext.urlPathname === '/hello-tsx' || pageContext.urlPathname === '/hello-tsx/') {
    const name = 'anonymous'
    return { routeParams: { name } }
  }
  return resolveRoute('/hello-tsx/@name', pageContext.urlPathname)
}
