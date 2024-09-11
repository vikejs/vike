export { Page }

import React from 'react'
import { Header } from './Header'
import { Features } from './features/Features'
import { Contributors, HorizontalLine, Link, Sponsors } from '@brillout/docpress'

function Page() {
  return (
    <>
      <Header />
      <HorizontalLine primary={true} />
      <Features />
      <HorizontalLine />
      <Sponsors />
      <HorizontalLine />
      <a id="team"></a>
      <Contributors />
      <div style={{ height: 50 }} />
    </>
  )
}
