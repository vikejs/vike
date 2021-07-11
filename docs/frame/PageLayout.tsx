import React from 'react'
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
  const isLandingPage = activeHeading.url === '/'
  return (
    <div
      style={{
        display: 'flex'
      }}
    >
      <Navigation headings={headings} />
      <div id="page-container" className={isLandingPage ? '' : 'doc-page'}>
        <MobileHeader />
        <div id="page-content">
          {!isLandingPage && <h1>{activeHeading.title}</h1>}
          {children}
        </div>
      </div>
    </div>
  )
}
