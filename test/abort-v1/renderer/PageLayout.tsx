import React from 'react'
import './PageLayout.css'
import { PageContextProvider } from './usePageContext'
import type { PageContext } from './types'

export { PageLayout }

function PageLayout({ children, pageContext }: { children: React.ReactNode; pageContext: PageContext }) {
  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <Layout>
          <Sidebar>
            <Nav href="/" />
            <Nav href="/about" />
            <Nav href="/redirect" />
            <Nav href="/render-homepage" />
            <Nav href="/show-error-page" />
            <Nav href="/permanent-redirect" />
            <Nav href="/redirect-external" />
          </Sidebar>
          <Content>{children}</Content>
        </Layout>
      </PageContextProvider>
    </React.StrictMode>
  )
}

function Nav({ href }: { href: string }) {
  return (
    <a href={href} style={{ padding: 3, textDecoration: 'none' }}>
      {href}
    </a>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        maxWidth: 900,
        margin: 'auto'
      }}
    >
      {children}
    </div>
  )
}

function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 20,
        paddingTop: 42,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        lineHeight: '1.8em'
      }}
    >
      {children}
    </div>
  )
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="page-content"
      style={{
        padding: 20,
        paddingBottom: 50,
        borderLeft: '2px solid #eee',
        minHeight: '100vh'
      }}
    >
      {children}
    </div>
  )
}
