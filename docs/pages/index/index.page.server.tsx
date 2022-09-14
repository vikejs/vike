import React from 'react'
import { Header, MobileCallToAction } from './Header'
import { Features } from './features/Features'
import { ContactUs, HorizontalLine, Sponsors } from 'vikepress'

export { Page }

function Page() {
  return (
    <>
      <Header />
      <HorizontalLine primary={true} />
      <Features />
      <HorizontalLine />
      <ContactUs text="Have a question? Want a feature? A tool integration is not working?" />
      <MobileCallToAction />
      <HorizontalLine />
      <Sponsors />
      <div style={{ height: 70 }} />
    </>
  )
}
