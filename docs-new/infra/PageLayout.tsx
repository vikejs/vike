import './main.css'
import React from 'react'
import iconPlugin from '../icons/vite-plugin-ssr.svg'
import { Navigation } from '../Navigation'
import { Heading } from './headings'
import './PageLayout.css'

export { PageLayout }

function PageLayout({
  headings,
  activeHeading,
  children
}: {
  headings: Heading[]
  activeHeading: number
  children: JSX.Element
}) {
  const sidePanelWidth = 300
  const heading = headings[activeHeading]
  const isLandingPage = heading.url === '/';
  return (
    <div
      style={{
        display: 'flex'
      }}
    >
      <div id="panel-left" style={{ flexShrink: 0, width: sidePanelWidth }}>
        <div
          style={{
            height: '100vh',
            width: sidePanelWidth,
            position: 'fixed',
            top: 0,
            overflowY: 'auto',
            borderRight: '1px solid #eee'
          }}
        >
          <NavigationHeader/>
          <Navigation headings={headings} />
        </div>
      </div>
      <div id={isLandingPage?"":"doc-page"}>
        {!isLandingPage && <h1>{heading.title}</h1>}
        {children}
      </div>
    </div>
  )
}

function NavigationHeader() {
  const SIZE = 50
  return (
    <a
      style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none', padding: 20, marginLeft: -5 }}
      href="/"
    >
      <img src={iconPlugin} height={SIZE} width={SIZE} />
      <code
        style={{ backgroundColor: '#f4f4f4', borderRadius: 4, fontSize: '1.35em', padding: '2px 5px', marginLeft: 10 }}
      >
        vite-plugin-ssr
      </code>
    </a>
  )
}

