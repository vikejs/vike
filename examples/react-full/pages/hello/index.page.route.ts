import { resolveRoute } from 'vike/routing'
import { RenderErrorPage } from 'vike/RenderErrorPage'

// Route Functions enables advanced routing logic
export default (pageContext: { urlPathname: string }) => {
  if (pageContext.urlPathname === '/hello' || pageContext.urlPathname === '/hello/') {
    const name = 'anonymous'
    return { routeParams: { name } }
  }
  return resolveRoute('/hello/@name', pageContext.urlPathname)
}

// The guard() hook enables to protect pages
export const guard = async (pageContext: { urlPathname: string }) => {
  if (pageContext.urlPathname === '/hello/forbidden') {
    await sleep(2 * 1000)
    throw RenderErrorPage({
      pageContext: { pageProps: { errorTitle: 'Forbidden', errorDescription: 'This page is forbidden.' } }
    })
  }
}
function sleep(milliseconds: number): Promise<void> {
  return new Promise((r) => setTimeout(r, milliseconds))
}
