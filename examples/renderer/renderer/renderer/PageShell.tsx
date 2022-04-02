export { PageShell }

import React from 'react'
import { PageContextProvider } from '../hooks/usePageContext'
import { Children, PageContext } from '../types'

function PageShell({ pageContext, children }: { pageContext: PageContext; children: Children }) {
  const PageLayout = pageContext.exports.PageLayout || Passthrough
  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <PageLayout>{children}</PageLayout>
      </PageContextProvider>
    </React.StrictMode>
  )
}

function Passthrough({ children }: { children: Children }) {
  return <>{children}</>
}
