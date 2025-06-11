import React from 'react'
import './Layout.css'
import { PageContextProvider } from './usePageContext'

export { Layout }

function Layout({ pageContext, children }) {
  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <Frame>
          <Sidebar>
            <a className="navitem" href="/">
              Home
            </a>
            <a className="navitem" href="/about">
              About
            </a>
            <a className="navitem" href="/star-wars">
              Star Wars
            </a>
          </Sidebar>
          <Content>{children}</Content>
        </Frame>
      </PageContextProvider>
    </React.StrictMode>
  )
}

function Frame({ children }) {
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

function Sidebar({ children }) {
  return (
    <div
      style={{
        padding: 20,
        paddingTop: 42,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        lineHeight: '1.8em',
      }}
    >
      {children}
    </div>
  )
}

function Content({ children }) {
  return (
    <div
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
