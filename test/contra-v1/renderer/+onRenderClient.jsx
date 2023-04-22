export default onRenderClient

import React from 'react'
import { createRoot } from 'react-dom/client'
import { PageLayout } from './PageLayout'

let root
async function onRenderClient(pageContext) {
  if (!root) root = createRoot(document.getElementById('react-container'))
  const { Page } = pageContext
  const page = (
    <PageLayout>
      <Page />
    </PageLayout>
  )
  root.render(page)
}
