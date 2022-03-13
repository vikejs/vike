import ReactDOM from 'react-dom'
import React from 'react'
import { PageShell } from './PageShell'
import type { PageContext } from './types'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client'

export { render }

async function render(pageContext: PageContextBuiltInClient & PageContext) {
  const { Page, pageProps } = pageContext
  ReactDOM.hydrate(
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>,
    document.getElementById('page-view'),
  )
}

/* To enable Client-side Routing:
export const clientRouting = true
// !! WARNING !! Before doing so, read https://vite-plugin-ssr.com/clientRouting */
