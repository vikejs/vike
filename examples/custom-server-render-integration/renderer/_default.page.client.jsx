import React from 'react'
import ReactDOM from 'react-dom'
import { getPage } from 'vite-plugin-ssr/client'

hydrate()

async function hydrate() {
  const pageContext = await getPage()
  const { Page } = pageContext
  ReactDOM.hydrate(<Page />, document.getElementById('react-root'))
}
