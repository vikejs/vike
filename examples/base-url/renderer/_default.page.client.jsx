import ReactDOM from 'react-dom'
import React from 'react'
import { useClientRouter } from 'vite-plugin-ssr/client/router'
import { PageShell } from './PageShell'

useClientRouter({
  render(pageContext) {
    const { Page, pageProps } = pageContext
    const page = (
      <PageShell pageContext={pageContext}>
        <Page {...pageProps} />
      </PageShell>
    )
    const container = document.getElementById('page-view')
    if (pageContext.isHydration) {
      ReactDOM.hydrate(page, container)
    } else {
      ReactDOM.render(page, container)
    }
  },
})
