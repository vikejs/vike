// https://vike.dev/onRenderClient
export { onRenderClient }

import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { PageLayout } from './PageLayout'
import type { OnRenderClientSync } from 'vike/types'

const onRenderClient: OnRenderClientSync = (pageContext): ReturnType<OnRenderClientSync> => {
  const { Page } = pageContext
  hydrateRoot(
    document.getElementById('page-view')!,
    <PageLayout>
      <Page />
    </PageLayout>
  )
}
