export { PageShell }

import React from 'react'
import './PageShell.css'
import { LayoutDefault } from './LayoutDefault'

function PageShell({ children, pageContext }) {
  const Layout = pageContext.exports.Layout || LayoutDefault
  return (
    <React.StrictMode>
      <Layout>{children}</Layout>
    </React.StrictMode>
  )
}
