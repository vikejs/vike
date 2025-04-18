export { Layout }

import React, { useEffect, useState } from 'react'
import './Layout.css'
import { usePageContext } from 'vike-react/usePageContext'
import { assert } from '../utils/assert'
import type { GlobalContextClient } from 'vike/types'

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
        <Left>
          {pageContext.someWrapperObj.staticUrls
            .filter((url) => !url.includes('config-meta'))
            .map((url) => (
              <Link href={url} key={url} />
            ))}
          <Link href="/nested-layout/42" />
        </Left>
        <Right>
          <div>{children}</div>
          <Footer />
        </Right>
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

function Left({ children }: { children: React.ReactNode }) {
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

function Right({ children }: { children: React.ReactNode }) {
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

function Footer() {
  const pageContext = usePageContext()
  const [n, setN] = useState<string | number>('hydrating...')
  useEffect(() => {
    const globalContext = pageContext.globalContext as GlobalContextClient
    const n = globalContext.setGloballyClient
    setN(n)
  })
  return (
    <div
      id="footer"
      style={{
        borderTop: '1px solid #eee',
        fontSize: '0.88em',
        marginTop: 50,
        paddingTop: 20,
        fontFamily: 'monospace'
      }}
    >
      <div>
        Constant number server-side <code>pageContext.globalContext.setGloballyServer</code>:{' '}
        <span id="setGloballyServer">{pageContext.globalContext.setGloballyServer}</span>
      </div>
      <div>
        Constant number client-side <code>pageContext.globalContext.setGloballyClient</code>:{' '}
        <span id="setGloballyClient">{n}</span>
      </div>
    </div>
  )
}
