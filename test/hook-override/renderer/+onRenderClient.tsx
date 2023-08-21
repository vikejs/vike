export default onRenderClient

import React from 'react'
import ReactDOM from 'react-dom/client'
import { PageLayout } from './PageLayout'
import type { PageContextClient } from './types'

let root: ReactDOM.Root
async function onRenderClient(pageContext: PageContextClient) {
  const { Page } = pageContext

  const page = (
    <PageLayout pageContext={pageContext}>
      <Page />
    </PageLayout>
  )

  const container = document.getElementById('page-view')!
  if (pageContext.isHydration) {
    root = ReactDOM.hydrateRoot(container, page)
  } else {
    if (!root) {
      root = ReactDOM.createRoot(container)
    }
    root.render(page)
  }
}
