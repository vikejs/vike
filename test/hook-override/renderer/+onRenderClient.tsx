export default onRenderClient

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Layout } from './Layout'
import type { PageContextClient } from 'vike/types'

let root: ReactDOM.Root
async function onRenderClient(pageContext: PageContextClient) {
  const { Page } = pageContext

  const page = (
    <Layout pageContext={pageContext}>
      <Page />
    </Layout>
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
