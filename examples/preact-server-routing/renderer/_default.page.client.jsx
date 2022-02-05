import { hydrate } from 'preact'
import { getPage } from 'vite-plugin-ssr/client'
import { PageShell } from './PageShell'

render()

async function render() {
  // We do Server Routing, but we can also do Client Routing by using `useClientRouter()`
  // instead of `getPage()`, see https://vite-plugin-ssr.com/useClientRouter
  const pageContext = await getPage()
  const { Page, pageProps } = pageContext
  const body = document.querySelector('body')

  if (body) {
    hydrate(
      <PageShell pageContext={pageContext}>
        <Page {...pageProps} />
      </PageShell>,
      body,
    )
  }
}
