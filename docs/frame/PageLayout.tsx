import React from 'react'
import { NavigationHeader } from './NavigationHeader'
import { Navigation } from './Navigation'
import { Heading } from '../headings'
import { MobileHeader } from './MobileHeader'
/* Won't work this this file is loaded only on the server
import './PageLayout.css'
*/

export { PageLayout }

function PageLayout({
  headings,
  activeHeading,
  children
}: {
  headings: Heading[]
  activeHeading: Heading
  children: JSX.Element
}) {
  const sidePanelWidth = 300
  const isLandingPage = activeHeading.url === '/'
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
          {!isLandingPage && <h1>{activeHeading.title}</h1>}
          {children}
        </div>
      </div>
    </div>
  )
}
