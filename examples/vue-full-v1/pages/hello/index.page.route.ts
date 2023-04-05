import { resolveRoute } from 'vite-plugin-ssr/routing'
import { RenderErrorPage } from 'vite-plugin-ssr/RenderErrorPage'
import { names } from './names'

// We use a Route Function to implement advanced routing logic
export default (pageContext: { urlPathname: string }) => {
  if (pageContext.urlPathname === '/hello' || pageContext.urlPathname === '/hello/') {
    const name = 'anonymous'
    return { routeParams: { name } }
  }
  const result = resolveRoute('/hello/@name', pageContext.urlPathname)
  if (!result.match) return false
  const { name } = result.routeParams
  if (!names.includes(name)) {
    const errorInfo = `Unknown name: ${name}.`
    throw RenderErrorPage({ pageContext: { pageProps: { errorInfo } } })
  }
  return { routeParams: { name } }
}
