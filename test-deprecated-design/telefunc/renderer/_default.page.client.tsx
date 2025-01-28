export { render }
export const clientRouting = true
export const hydrationCanBeAborted = true

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Layout } from './Layout'

let root: ReactDOM.Root
async function render(pageContext: any) {
  const { Page, pageProps } = pageContext
  const page = (
    <Layout>
      <Page {...pageProps} />
    </Layout>
  )
  const container = document.getElementById('root')!
  if (pageContext.isHydration) {
    root = ReactDOM.hydrateRoot(container, page)
  } else {
    if (!root) {
      root = ReactDOM.createRoot(container)
    }
    root.render(page)
  }
}
