export { render }

import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { Layout } from './Layout'
import type { PageContext } from '#root/types'

async function render(pageContext: PageContext) {
  const { Page } = pageContext
  hydrateRoot(
    document.getElementById('root')!,
    <Layout>
      <Page />
    </Layout>,
  )
}
