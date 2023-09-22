// https://vike.dev/onRenderClient
export default onRenderClient

import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

async function onRenderClient(pageContext) {
  const { Page } = pageContext
  hydrateRoot(
    document.getElementById('react-root'),
    <BrowserRouter>
      <Page {...pageContext.pageProps} />
    </BrowserRouter>
  )
}
