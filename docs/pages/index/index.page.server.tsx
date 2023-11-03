import React from 'react'
import { Header, MobileCallToAction } from './Header'
import { Features } from './features/Features'
import { HorizontalLine, Link, Sponsors } from '@brillout/docpress'

export { Page }

function Page() {
  return (
    <>
      <GlobalNote />
      <Header />
      <HorizontalLine primary={true} />
      <Features />
      <MobileCallToAction />
      <HorizontalLine />
      <Sponsors />
      <div style={{ height: 50 }} />
    </>
  )
}

function GlobalNote() {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
        <blockquote>
          <p>
            The <i>V1 design</i> has been released, see <Link text="migration guide" href="/migration/v1-design" />.
          </p>
        </blockquote>
      </div>
    </>
  )
}
