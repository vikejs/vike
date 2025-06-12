export { Layout }

import './style.css'
import React from 'react'
import logoUrl from '../assets/logo.svg'
import { Link } from '../components/Link'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        maxWidth: 900,
        margin: 'auto',
      }}
    >
      <Sidebar>
        <Logo />
        <Link href="/">Welcome</Link>
        <Link href="/star-wars">Data Fetching</Link>
        <Link href="/streaming">HTML Streaming</Link>
        <Link href="/without-ssr">Without SSR</Link>
        <Link href="/starship">Nested Layout</Link>
        <Link href="/client-only">Client Only</Link>
        <Link href="/images">useConfig()</Link>
      </Sidebar>
      <Content>{children}</Content>
    </div>
  )
}

function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="sidebar"
      style={{
        padding: 20,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        lineHeight: '1.8em',
        borderRight: '2px solid #eee',
      }}
    >
      {children}
    </div>
  )
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div id="page-container">
      <div
        id="page-content"
        style={{
          padding: 20,
          paddingBottom: 50,
          minHeight: '100vh',
        }}
      >
        {children}
      </div>
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
