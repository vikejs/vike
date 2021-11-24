import ReactDOM from 'react-dom'
import React from 'react'
import { useClientRouter } from 'vite-plugin-ssr/client/router'
import { PageLayout } from './PageLayout'

useClientRouter({
  render(pageContext) {
    const { Page, pageProps } = pageContext
    const page = (
      <PageLayout pageContext={pageContext}>
        <Page {...pageProps} />
      </PageLayout>
    )
    const container = document.getElementById('page-view')
    if (pageContext.isHydration) {
      ReactDOM.hydrate(page, container)
    } else {
      ReactDOM.render(page, container)
    }
  },
})
