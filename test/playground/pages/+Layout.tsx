export { Layout }

import React from 'react'
import './Layout.css'
import { usePageContext } from 'vike-react/usePageContext'
import { assert } from '../utils/assert'

function Layout({ children }: { children: React.ReactNode }) {
  const pageContext = usePageContext()
  if (import.meta.env.SSR) {
    assert(pageContext.someWrapperObj.neverPassedToClient === 123)
  } else {
    assert(!('neverPassedToClient' in pageContext.someWrapperObj))
  }
  return (
    <React.StrictMode>
      <Frame>
        <Sidebar>
          {pageContext.someWrapperObj.staticUrls
            .filter((url) => !url.includes('config-meta'))
            .map((url) => (
              <Link href={url} key={url} />
            ))}
          <Link href="/nested-layout/42" />
        </Sidebar>
        <Content>{children}</Content>
      </Frame>
    </React.StrictMode>
  )
}

function Link({ href }: { href: string }) {
  return (
    <a className="navitem" href={href} style={{ paddingRight: 20 }}>
      <code>{href}</code>
    </a>
  )
}

function Frame({ children }: { children: React.ReactNode }) {
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
