import ReactDOM from 'react-dom'
import React from 'react'
import { PageShell } from './PageShell'

export { render }

async function render(pageContext) {
  // We do Server Routing, but we can also do Client Routing by using `useClientRouter()`
  // instead of `getPage()`, see https://vite-plugin-ssr.com/useClientRouter
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
