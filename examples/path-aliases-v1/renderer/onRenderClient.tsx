// https://vike.dev/onRenderClient
export { onRenderClient }

import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { PageLayout } from './PageLayout'
import type { PageContextClient } from '#root/types'
import type { OnRenderClient } from 'vike/types'

const onRenderClient: OnRenderClient = async (pageContext: PageContextClient): ReturnType<OnRenderClient> => {
  const { Page } = pageContext
  hydrateRoot(
    document.getElementById('page-view')!,
    <PageLayout>
      <Page />
    </PageLayout>
  )
}
