export default onRenderClient

import React from 'react'
import ReactDOM from 'react-dom/client'
import { renderError } from 'vike/client/router'
import { Layout } from './Layout'
import { assert } from '../utils/assert'
import type { PageContextClient } from './types'

let root: ReactDOM.Root
async function onRenderClient(pageContext: PageContextClient) {
  assert(Array.isArray(pageContext.pageContextsAborted))

  const { Page } = pageContext
  const page = (
    <Layout pageContext={pageContext}>
      <Page />
    </Layout>
  )

  const container = document.getElementById('root')!
  if (pageContext.isHydration) {
    root = ReactDOM.hydrateRoot(container, page, { onUncaughtError: renderError })
  } else {
    if (!root) {
      root = ReactDOM.createRoot(container, { onUncaughtError: renderError })
    }
    root.render(page)
  }
}
