import React from 'react'
import { PageContextProvider } from './usePageContext'
import type { PageContext } from './types'

export { PageShell }

function PageShell({ pageContext, children }: { pageContext: PageContext; children: React.ReactNode }) {
  return (
    <React.StrictMode>
      <a href="/">
        <button>Home</button>
      </a>
      <a href="/auth">
        <button>Auth</button>
      </a>
      <PageContextProvider pageContext={pageContext}>{children}</PageContextProvider>
    </React.StrictMode>
  )
}
