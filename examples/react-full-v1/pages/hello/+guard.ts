export default guard

import { RenderErrorPage } from 'vite-plugin-ssr/RenderErrorPage'

// The guard() hook enables to protect pages
async function guard(pageContext: { urlPathname: string }) {
  if (pageContext.urlPathname === '/hello/forbidden') {
    await sleep(2 * 1000) // Unline Route Functions, guard() can be async
    throw RenderErrorPage({
      pageContext: { pageProps: { errorTitle: 'Forbidden', errorDescription: 'This page is forbidden.' } }
    })
  }
}
function sleep(milliseconds: number): Promise<void> {
  return new Promise((r) => setTimeout(r, milliseconds))
}
