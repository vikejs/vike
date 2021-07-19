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
  isLandingPage,
  pageTitle,
  children
}: {
  headings: Heading[]
  activeHeading: Heading | null
  pageTitle: string | JSX.Element | null
  isLandingPage: boolean
  children: JSX.Element
}) {
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
          {pageTitle && <h1>{pageTitle}</h1>}
          {children}
        </div>
      </div>
    </div>
  )
}
