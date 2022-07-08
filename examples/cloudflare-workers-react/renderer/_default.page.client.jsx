export { render }

import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { PageLayout } from './PageLayout'
import { ReactStreaming } from 'react-streaming/client'

async function render(pageContext) {
  const { Page, pageProps } = pageContext
  hydrateRoot(
    document.getElementById('page-view'),
    <ReactStreaming>
      <PageLayout pageContext={pageContext}>
        <Page {...pageProps} />
      </PageLayout>
    </ReactStreaming>,
  )
}
