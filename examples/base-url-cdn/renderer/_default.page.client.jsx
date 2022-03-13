export const clientRouting = true
export { render }

import ReactDOM from 'react-dom'
import React from 'react'
import { PageShell } from './PageShell'

async function render(pageContext) {
  const { Page, pageProps } = pageContext
  const page = (
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>
  )
  const container = document.getElementById('page-view')
  if (pageContext.isHydration) {
    ReactDOM.hydrate(page, container)
  } else {
    ReactDOM.render(page, container)
  }
}
