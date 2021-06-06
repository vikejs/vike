import React from 'react'
import ReactDOM from 'react-dom'
import { getPage } from 'vite-plugin-ssr/client'
//import "prismjs/themes/prism-tomorrow.css"
//import "prismjs/themes/prism.css"
//import 'highlight.js/styles/github.css';
import 'highlight.js/styles/stackoverflow-light.css';

hydrate()

async function hydrate() {
  const pageContext = await getPage()
  const { Page, pageProps } = pageContext
  const page = <Page {...pageProps} />
  const container = document.getElementById('page-view')
  ReactDOM.hydrate(page, container)
}
