export { render }
export const clientRouting = true
export const hydrationCanBeAborted = true

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Layout } from './Layout'

let root
async function render(pageContext) {
  const { Page, routeParams } = pageContext

  const page = (
    <Layout>
      <Page routeParams={routeParams} />
    </Layout>
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
