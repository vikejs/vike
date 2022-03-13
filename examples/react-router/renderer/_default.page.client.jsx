export { render }

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

async function render(pageContext) {
  const { Page } = pageContext
  ReactDOM.hydrate(
    <BrowserRouter>
      <Page {...pageContext.pageProps} />
    </BrowserRouter>,
    document.getElementById('react-root'),
  )
}
