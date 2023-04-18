import React from 'react'
import { PageContextProvider } from './usePageContext'
import type { PageContext } from './types'

export { PageShell }

function PageShell({ children, pageContext }: { children: React.ReactNode; pageContext: PageContext }) {
  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <main>{children}</main>
      </PageContextProvider>
    </React.StrictMode>
  )
}
