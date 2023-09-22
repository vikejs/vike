// https://vike.dev/onRenderClient
export default onRenderClient

import { hydrate } from 'preact'
import { PageShell } from './PageShell'

async function onRenderClient(pageContext) {
  const { Page, pageProps } = pageContext
  const body = document.querySelector('body')
  hydrate(
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>,
    body
  )
}
