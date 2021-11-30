import React from 'react'
import { Provider as SessionProvider } from 'next-auth/client'
import { PageContextProvider } from './usePageContext'
import type { PageContext } from './types'
import { Link } from './Link'
import { Session } from 'next-auth'

export { PageShell }

function PageShell({
  pageContext,
  children,
}: {
  pageContext: PageContext & { session: Session | null }
  children: React.ReactNode
}) {
  return (
    <React.StrictMode>
      <SessionProvider session={pageContext.session || undefined}>
        <PageContextProvider pageContext={pageContext}>
          <Link href="/">
            <button>Home</button>
          </Link>
          <Link href="/auth">
            <button>Auth</button>
          </Link>

          {children}
        </PageContextProvider>
      </SessionProvider>
    </React.StrictMode>
  )
}
