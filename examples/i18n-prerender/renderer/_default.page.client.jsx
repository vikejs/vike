export { render }

import ReactDOM from 'react-dom'
import React from 'react'
import { PageShell } from './PageShell'

async function render(pageContext) {
  const { Page, pageProps } = pageContext
  ReactDOM.hydrate(
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>,
    document.getElementById('page-view'),
  )
}
