import ReactDOM from 'react-dom'
import { useClientRouter } from 'vite-plugin-ssr/client/router'
import React from 'react'
import { PageLayout } from './PageLayout'

useClientRouter({
  render(pageContext) {
    const { Page, routeParams } = pageContext

    const page = (
      <PageLayout>
        <Page routeParams={routeParams} />
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
