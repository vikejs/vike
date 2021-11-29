import React from 'react'
import ReactDOM from 'react-dom'
import { useClientRouter } from 'vite-plugin-ssr/client/router'
import { PageShell } from './PageShell'
import { getPageTitle } from './getPageTitle'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client/router'
import type { PageContext } from './types'

useClientRouter({
  render(pageContext: PageContextBuiltInClient & PageContext) {
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
    document.title = getPageTitle(pageContext)
  },
})
