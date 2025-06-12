import React from 'react'
import './Layout.css'
import logoUrl from './logo.svg'

export { Layout }

function Layout({ children }) {
  return (
    <React.StrictMode>
      <Frame>
        <Sidebar>
          <Logo />
          <a className="navitem" href="/">
            Preload Default
          </a>
          <a className="navitem" href="/preload-disabled">
            Preload Disabled
          </a>
          <a className="navitem" href="/preload-images">
            Preload Images
          </a>
        </Sidebar>
        <Content>{children}</Content>
      </Frame>
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
        paddingTop: 20,
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

function Logo() {
  return (
    <div
      style={{
        marginTop: 20,
        marginBottom: 10,
      }}
    >
      <a href="/">
        <img src={logoUrl} height={64} width={64} />
      </a>
    </div>
  )
}
