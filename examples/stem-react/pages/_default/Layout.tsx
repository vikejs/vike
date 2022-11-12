export { Layout }

import './style.css'
import React from 'react'
import logoUrl from './logo.svg'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        maxWidth: 900,
        margin: 'auto'
      }}
    >
      <Sidebar>
        <Logo />
        <Link href="/">Welcome</Link>
        <Link href="/star-wars">Data Fetching</Link>
      </Sidebar>
      <Content>{children}</Content>
    </div>
  )
}

function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 20,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        lineHeight: '1.8em',
        borderRight: '2px solid #eee'
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
          minHeight: '100vh'
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
        marginBottom: 10
      }}
    >
      <a href="/">
        <img src={logoUrl} height={64} width={64} />
      </a>
    </div>
  )
}

/* TOOD
function Link({ href, children }: { href: string; children: string }) {
  const pageContext = usePageContext()
  const urlPathname = pageContext.urlPathname
  const isActive = normalize(urlPathname) === normalize(href)
  const isActiveParent = !isActive && normalize(urlPathname).startsWith(`${normalize(href)}/`)
  const className = ['navigation-link', isActive && 'is-active', isActiveParent && 'is-active-parent']
    .filter(Boolean)
    .join(' ')
  return (
    <a href={href} className={className}>
      {children}
    </a>
  )
}
*/

function Link({ href, children }: { href: string; children: string }) {
  return <a href={href}>{children}</a>
}
