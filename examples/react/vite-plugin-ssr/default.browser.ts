import ReactDOM from 'react-dom'
import React from 'react'
import { getPage } from 'vite-plugin-ssr/client'

hydrate()

async function hydrate() {
  const page = await getPage()
  const app = React.createElement(page.view, page.initialProps)
  //@ts-ignore
  ReactDOM.hydrate(app, document.getElementById('page-view'))
}
