export { render }

import { hydrate } from 'preact'
import { PageShell } from './PageShell'

async function render(pageContext) {
  const { Page, pageProps } = pageContext
  const body = document.querySelector('body')
  hydrate(
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>,
    body,
  )
}
