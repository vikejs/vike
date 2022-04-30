export { render }

import ReactDOM from 'react-dom/client'
import React from 'react'
import { PageLayout } from './PageLayout'
import { ReactStreaming } from 'react-streaming/client'

async function render(pageContext) {
  const { Page, pageProps } = pageContext
  ReactDOM.hydrateRoot(
    document.getElementById('page-view'),
    <ReactStreaming>
      <PageLayout pageContext={pageContext}>
        <Page {...pageProps} />
      </PageLayout>
    </ReactStreaming>,
  )
}
