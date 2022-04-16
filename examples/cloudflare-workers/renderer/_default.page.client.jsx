export { render }

import ReactDOM from 'react-dom/client'
import React from 'react'
import { PageLayout } from './PageLayout'
import { SsrDataProvider } from './useSsrData'

async function render(pageContext) {
  const { Page, pageProps } = pageContext
  ReactDOM.hydrateRoot(
    document.getElementById('page-view'),
    <SsrDataProvider>
      <PageLayout>
        <Page {...pageProps} />
      </PageLayout>
    </SsrDataProvider>,
  )
}
