import React from 'react'
import './Layout.css'
import { PageContextProvider } from './usePageContext'
import type { PageContext } from './types'

export { Layout }

function Layout({ children, pageContext }: { children: React.ReactNode; pageContext: PageContext }) {
  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <Frame>
          <Sidebar>
            <Nav href="/" />
            <Nav href="/about" />
            <Nav href="/redirect" />
            <Nav href="/render-homepage" />
            <Nav href="/show-error-page" />
            <Nav href="/permanent-redirect" />
            <Nav href="/redirect-external" />
            <Nav href="/star-wars-api/films/1.json" />
          </Sidebar>
          <Content>{children}</Content>
        </Frame>
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

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        maxWidth: 900,
        margin: 'auto',
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
        lineHeight: '1.8em',
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
        minHeight: '100vh',
      }}
    >
      {children}
    </div>
  )
}
