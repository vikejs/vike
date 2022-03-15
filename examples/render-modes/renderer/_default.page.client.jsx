export { render }

import ReactDOM from 'react-dom'
import React from 'react'
import { PageLayout } from './PageLayout'

async function render(pageContext) {
  const { Page, pageProps } = pageContext
  if( Page ) {
  ReactDOM.hydrate(
    <PageLayout>
      <Page {...pageProps} />
    </PageLayout>,
    document.getElementById('page-view'),
  )
  }
}
