export { render }

import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { PageShell } from './PageShell'
import { PageContext } from '../types'

async function render(pageContext: PageContext) {
  const { Page, pageProps } = pageContext
  hydrateRoot(
    document.getElementById('page-view')!,
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>,
  )
}
