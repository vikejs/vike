export default onRenderClient

import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { PageLayout } from './PageLayout'
import type { PageContext } from '#root/types'

async function onRenderClient(pageContext: PageContext) {
  const { Page } = pageContext
  hydrateRoot(
    document.getElementById('page-view')!,
    <PageLayout>
      <Page />
    </PageLayout>
  )
}
