// https://vike.dev/onRenderClient
export { onRenderClient }

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Layout } from './Layout'
import type { PageContextClient } from 'vike/types'

let root: ReactDOM.Root
const onRenderClient = async (pageContext: PageContextClient) => {
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
