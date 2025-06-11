export { Layout }

import './Layout.css'
import React from 'react'

function Layout({ children }) {
  return (
    <React.StrictMode>
      <Frame>
        <Sidebar>
          <a className="navitem" href="/">
            <b>Render Modes</b>
          </a>
          <a className="navitem" href="/html-only">
            HTML only
          </a>
          <a className="navitem" href="/spa">
            SPA
          </a>
          <a className="navitem" href="/html-js">
            HTML + JS
          </a>
          <a className="navitem" href="/ssr">
            SSR
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
