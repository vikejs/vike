import React from 'react'
import pluginLogo from './logos/plugin.svg'
import reactLogo from './logos/react.svg'
import './PageLayout.css'

export { PageLayout }

function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <React.StrictMode>
      <div
        className="page-layout"
        style={{
          display: 'none'
        }}
      >
        <PageNavigation />
        <PageContent>{children}</PageContent>
      </div>
    </React.StrictMode>
  )
}

function PageContent({ children }: { children: React.ReactNode }) {
  return <div className="page-content">{children}</div>
}

function PageNavigation() {
  return (
    <div className="page-navigation">
      <Header />
      <a href="/markdown">Markdown</a>
      <a href="/zero-js">Zero JS</a>
    </div>
  )
}

function Header() {
  return (
    <a href="/" className="header">
      <img src={pluginLogo} height={30} />
      <img src={reactLogo} height={20} className="react-logo" />
    </a>
  )
}
