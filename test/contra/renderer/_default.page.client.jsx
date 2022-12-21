export { render }
export const clientRouting = true
export const hydrationCanBeAborted = true

import React from 'react'
import { createRoot } from 'react-dom/client'
import { PageLayout } from './PageLayout'

let root
async function render(pageContext) {
  if (!root) root = createRoot(document.getElementById('react-container'))
  const { Page } = pageContext
  const page = (
    <PageLayout>
      <Page />
    </PageLayout>
  )
  root.render(page)
}
