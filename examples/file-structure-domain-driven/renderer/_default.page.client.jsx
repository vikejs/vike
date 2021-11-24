import ReactDOM from 'react-dom'
import React from 'react'
import { getPage } from 'vite-plugin-ssr/client'
import { PageLayout } from './PageLayout'

hydrate()

async function hydrate() {
  const pageContext = await getPage()
  const { Page, routeParams } = pageContext
  ReactDOM.hydrate(
    <PageLayout>
      <Page routeParams={routeParams} />
    </PageLayout>,
    document.getElementById('page-view'),
  )
}
