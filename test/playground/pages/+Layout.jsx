export { Layout }

import React from 'react'
import './Layout.css'

function Layout({ children }) {
  return (
    <React.StrictMode>
      <Frame>
        <Sidebar>
          <Link href="/" />
          <Link href="/about" />
          <Link href="/markdown" />
          <Link href="/pushState" />
          <Link href="/dynamic-import-file-env" />
          <Link href="/navigate-early" />
          <Link href="/nested-layout/42" />
        </Sidebar>
        <Content>{children}</Content>
      </Frame>
    </React.StrictMode>
  )
}

function Link({ href }) {
  return (
    <a className="navitem" href={href} style={{ paddingRight: 20 }}>
      <code>{href}</code>
    </a>
  )
}

function Frame({ children }) {
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

function Sidebar({ children }) {
  return (
    <div
      style={{
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

function Content({ children }) {
  return (
    <div
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
