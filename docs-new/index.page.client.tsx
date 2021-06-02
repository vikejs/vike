import React from 'react'
import ReactDOM from 'react-dom'
import { getPage } from 'vite-plugin-ssr/client'

hydrate()

async function hydrate() {
  const pageContext = await getPage()
  const { Page, pageProps } = pageContext
  const page = <Page {...pageProps} />
  const container = document.getElementById('page-view')
  ReactDOM.hydrate(page, container)
}
