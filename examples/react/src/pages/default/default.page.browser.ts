import ReactDOM from 'react-dom'
import React from 'react'
import { getPage } from 'vite-plugin-ssr/client'
import './default.css'

hydrate()

async function hydrate() {
  const { pageView, initialProps } = await getPage()

  const app = React.createElement(pageView, initialProps)
  ReactDOM.hydrate(app, document.getElementById('page-view'))
  console.log('initialProps:', initialProps)
}
