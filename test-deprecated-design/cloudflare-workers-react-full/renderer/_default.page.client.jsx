export { render }

import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { Layout } from './Layout'

async function render(pageContext) {
  const { Page, pageProps } = pageContext
  hydrateRoot(
    document.getElementById('page-view'),
    <Layout pageContext={pageContext}>
      <Page {...pageProps} />
    </Layout>
  )
}
