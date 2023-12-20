export { render }
export const clientRouting = true
export const hydrationCanBeAborted = true

import React from 'react'
import ReactDOM from 'react-dom/client'
import { PageLayout } from './PageLayout'

let root: ReactDOM.Root
async function render(pageContext: any) {
  const { Page, pageProps } = pageContext
  const page = (
    <PageLayout>
      <Page {...pageProps} />
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
