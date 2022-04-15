export { render }

import ReactDOM from 'react-dom/client'
import React from 'react'
import { PageLayout } from './PageLayout'

async function render(pageContext) {
  const { Page, pageProps } = pageContext
  const root = ReactDOM.createRoot(document.getElementById('page-view'))
  root.render(
    <PageLayout>
      <Page {...pageProps} />
    </PageLayout>
  )
}
