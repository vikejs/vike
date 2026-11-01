// https://vike.dev/onRenderClient
export { onRenderClient }

import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { Layout } from './Layout'

let root

async function onRenderClient(pageContext) {
  const { Page } = pageContext
  const page = (
    <Layout>
      <Page />
    </Layout>
  )
  if (!root) {
    // Simulate slow hydration (e.g. lazy-loaded code or data)
    window.__hydrationStarted = true
    await new Promise((resolve) => setTimeout(resolve, 2000))
    root = hydrateRoot(document.getElementById('root'), page)
  } else {
    root.render(page)
  }
}
