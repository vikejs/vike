export { render }

import ReactDOM from 'react-dom'
import React from 'react'
import { PageShell } from './PageShell'
import { PageContext } from '../types'

async function render(pageContext: PageContext) {
  const { Page, pageProps } = pageContext
  ReactDOM.hydrate(
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>,
    document.getElementById('page-view'),
  )
}
