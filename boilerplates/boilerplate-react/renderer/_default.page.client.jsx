import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { PageShell } from './PageShell'

export { render }

async function render(pageContext) {
  const { Page, pageProps } = pageContext
  hydrateRoot(
    document.getElementById('page-view'),
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>
  )
}

/* To enable Client-side Routing:
export const clientRouting = true
// !! WARNING !! Before doing so, read https://vite-plugin-ssr.com/clientRouting */
