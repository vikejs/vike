export { render }

import React from 'react'
import { hydrate } from 'react-dom'
import { PageLayout } from './PageLayout'

async function render(pageContext) {
  const { Page, pageProps } = pageContext
  hydrate(
    <PageLayout>
      <Page {...pageProps} />
    </PageLayout>,
    document.getElementById('page-view'),
  )
}
