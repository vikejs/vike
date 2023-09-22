// https://vike.dev/onRenderClient
export default onRenderClient

import { hydrate, render } from 'preact'
import { PageShell } from './PageShell'

async function onRenderClient(pageContext) {
  const { Page, pageProps } = pageContext
  const page = (
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>
  )
  const container = document.querySelector('body')

  if (pageContext.isHydration) {
    hydrate(page, container)
  } else {
    render(page, container)
  }
  document.title = getPageTitle(pageContext)
}

function getPageTitle(pageContext) {
  const title = (pageContext.config.documentProps || {}).title || (pageContext.documentProps || {}).title || 'Demo'
  return title
}
