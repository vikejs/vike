import ReactDOM from 'react-dom'
import React from 'react'
import { getPage } from 'vite-plugin-ssr/client'
import './default.css'
import { PageLayout } from './PageLayout'

hydrate()

async function hydrate() {
  const { pageView, initialProps } = await getPage()

  const app = (
    <PageLayout>{React.createElement(pageView, initialProps)}</PageLayout>
  )
  ReactDOM.hydrate(app, document.getElementById('page-view'))
  console.log('initialProps:', initialProps)
}
