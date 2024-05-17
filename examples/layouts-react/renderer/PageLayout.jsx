export { PageLayout }

import React from 'react'
import './PageLayout.css'
import { LayoutDefault } from './LayoutDefault'
import { PageContextProvider } from './usePageContext'

function PageLayout({ children, pageContext }) {
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
