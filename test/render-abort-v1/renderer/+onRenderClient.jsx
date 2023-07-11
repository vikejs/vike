export default onRenderClient

import React from 'react'
import ReactDOM from 'react-dom/client'
import { PageLayout } from './PageLayout'

let root
async function onRenderClient(pageContext) {
  const { Page } = pageContext

  const page = (
    <PageLayout>
      <Page />
    </PageLayout>
  )

  const container = document.getElementById('page-view')
  if (pageContext.isHydration) {
    root = ReactDOM.hydrateRoot(container, page)
  } else {
    if (!root) {
      root = ReactDOM.createRoot(container)
    }
    root.render(page)
  }
}
