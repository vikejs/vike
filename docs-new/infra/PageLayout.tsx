import React from 'react'
import { NavigationHeader } from './NavigationHeader'
import { Navigation } from '../Navigation'
import { Heading } from './headings'
import { MobileHeader } from './MobileHeader'
import './PageLayout.css'

export { PageLayout }

function PageLayout({
  headings,
  activeHeadingIdx,
  children
}: {
  headings: Heading[]
  activeHeadingIdx: number
  children: JSX.Element
}) {
  const sidePanelWidth = 300
  const heading = headings[activeHeadingIdx]
  const isLandingPage = heading.url === '/'
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
          <NavigationHeader />
          <Navigation headings={headings} />
        </div>
      </div>
      <div id={isLandingPage ? '' : 'doc-page'}>
        <MobileHeader />
        <div id="page-content">
          {!isLandingPage && <h1>{heading.title}</h1>}
          {children}
        </div>
      </div>
    </div>
  )
}
