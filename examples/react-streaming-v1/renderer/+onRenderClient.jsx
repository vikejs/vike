// https://vite-plugin-ssr.com/onRenderClient
export default onRenderClient

import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { PageLayout } from './PageLayout'

async function onRenderClient(pageContext) {
  const { Page, pageProps } = pageContext
  hydrateRoot(
    document.getElementById('page-view'),
    <PageLayout>
      <Page {...pageProps} />
    </PageLayout>
  )
}
