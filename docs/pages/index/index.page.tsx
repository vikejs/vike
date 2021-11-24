import React from 'react'
import { Header, MobileCallToAction } from './Header'
import { Features } from './features/Features'
import { ContactUs } from 'libframe-docs/landing-page/ContactUs'
import { HorizontalLine } from 'libframe-docs/landing-page/HorizontalLine'

export { Page }

function Page() {
  return (
    <>
      <Header />
      <HorizontalLine primary={true} />
      <Features />
      <HorizontalLine />
      <ContactUs />
      <MobileCallToAction />
      <div style={{ height: 70 }} />
    </>
  )
}
