export { render }

import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

async function render(pageContext) {
  const { Page } = pageContext
  hydrateRoot(
    document.getElementById('react-root'),
    <BrowserRouter>
      <Page {...pageContext.pageProps} />
    </BrowserRouter>,
  )
}
