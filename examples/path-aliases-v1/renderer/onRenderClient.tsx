// https://vike.dev/onRenderClient
export { onRenderClient }

import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { PageLayout } from './PageLayout'
import type { PageContextClient } from '#root/types'
import type { Config } from 'vike/types'

const onRenderClient: Config['onRenderClient'] = (pageContext: PageContextClient): void => {
  const { Page } = pageContext
  hydrateRoot(
    document.getElementById('page-view')!,
    <PageLayout>
      <Page />
    </PageLayout>
  )
}
