export { render }

import ReactDOM from 'react-dom'
import React from 'react'
import { PageLayout } from './PageLayout'
import type { PageContext } from '#root/types'

async function render(pageContext: PageContext) {
  const { Page } = pageContext
  ReactDOM.hydrate(
    <PageLayout>
      <Page />
    </PageLayout>,
    document.getElementById('page-view'),
  )
}
