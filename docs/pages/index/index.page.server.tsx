import React from 'react'
import { Header, MobileCallToAction } from './Header'
import { Features } from './features/Features'
import { ContactUs } from 'vikepress'
import { HorizontalLine } from 'vikepress'

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
      <div style={{ height: 70 }} />
    </>
  )
}
