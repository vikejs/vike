export { render }

import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { Layout } from './Layout'

async function render(pageContext) {
  const { Page, pageProps } = pageContext
  hydrateRoot(
    document.getElementById('root'),
    <Layout>
      <Page {...pageProps} />
    </Layout>,
  )
}
