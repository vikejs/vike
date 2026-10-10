export default onRenderClient

import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { Layout } from './Layout'

let root
async function onRenderClient(pageContext) {
  const { Page, pageProps } = pageContext
  const page = (
    <Layout>
      <Page {...pageProps} />
    </Layout>
  )
  if (pageContext.isHydration) {
    root = hydrateRoot(document.getElementById('root'), page)
  } else {
    root.render(page)
  }
}
