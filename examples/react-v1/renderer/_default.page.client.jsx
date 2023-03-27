export { render }

import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { PageLayout } from './PageLayout'

async function render(pageContext) {
  const { Page } = pageContext
  hydrateRoot(
    document.getElementById('page-view'),
    <PageLayout>
      <Page />
    </PageLayout>
  )
}
