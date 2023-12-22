export { PageShell }

import React from 'react'
import './PageShell.css'
import { LayoutDefault } from './LayoutDefault'
import { PageContextProvider } from './usePageContext'

function PageShell({ children, pageContext }) {
  // The config 'Layout' is a custom config we defined at ./+config.ts
  const Layout = pageContext.config.Layout || LayoutDefault
  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <Layout>{children}</Layout>
      </PageContextProvider>
    </React.StrictMode>
  )
}
