export { onRenderClient }

import React from 'react'
import { hydrateRoot, createRoot, type Root } from 'react-dom/client'
// @ts-ignore
import { PageLayout } from './PageLayout'
import type { OnRenderClientAsync } from 'vike/types'
import { getTitle } from './getTitle'

let root: Root
const onRenderClient: OnRenderClientAsync = async (pageContext): ReturnType<OnRenderClientAsync> => {
  const { Page, pageProps } = pageContext
  const page = (
    <PageLayout>
      <Page {...pageProps} />
    </PageLayout>
  )

  const container = document.getElementById('page-view')!
  if (pageContext.isHydration) {
    root = hydrateRoot(container, page)
  } else {
    if (!root) {
      root = createRoot(container)
    }
    root.render(page)
  }

  if (!pageContext.isHydration) {
    const title = getTitle(pageContext)
    window.document.title = title
  } else {
    // Already set by onRenderHtml() with <title> tag.
  }
}
