// https://vike.dev/onRenderClient
export { onRenderClient }

import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { PageLayout } from './PageLayout'

let reactRoot
async function onRenderClient(pageContext) {
  const { Page, pageProps } = pageContext

  const page = (
    <PageLayout pageContext={pageContext}>
      <Page {...pageProps} />
    </PageLayout>
  )

  const reactRootElem = document.getElementById('react-root')
  if (pageContext.isHydration) {
    reactRoot = hydrateRoot(reactRootElem, page)
  } else {
    if (!reactRoot) {
      reactRoot = createRoot(reactRootElem)
    }
    reactRoot.render(page)
  }
}
