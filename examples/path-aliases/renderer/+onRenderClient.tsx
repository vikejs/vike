// https://vike.dev/onRenderClient
export { onRenderClient }

import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { PageLayout } from './PageLayout'
import type { OnRenderClientAsync } from 'vike/types'

const onRenderClient: OnRenderClientAsync = async (pageContext): ReturnType<OnRenderClientAsync> => {
  const { Page } = pageContext
  hydrateRoot(
    document.getElementById('page-view')!,
    <PageLayout>
      <Page />
    </PageLayout>
  )
}
