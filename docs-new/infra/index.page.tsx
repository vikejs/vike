import React from 'react'
import { Header, MobileCallToAction } from '../Header'
import { Features } from '../features/Features'

export { Page }

function Page() {
  return (
    <>
      <Header />
      <Features />
      <MobileCallToAction />
    </>
  )
}
