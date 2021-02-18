import ReactDOM from 'react-dom'
import React from 'react'
import { getPage } from 'vite-plugin-ssr/client'
import { PageLayout } from '../components/PageLayout/PageLayout'

hydrate()

async function hydrate() {
  const { Page, initialProps } = await getPage()

  ReactDOM.hydrate(
    <PageLayout>
      <Page {...initialProps} />
    </PageLayout>,
    document.getElementById('page-view')
  )
}
