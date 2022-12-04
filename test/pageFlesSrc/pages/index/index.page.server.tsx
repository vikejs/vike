import React from 'react'
import { Header, MobileCallToAction } from './Header'
import { Features } from './features/Features'
import { HorizontalLine, Sponsors } from '@brillout/docpress'

export { Page }

function Page() {
  return (
    <>
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
