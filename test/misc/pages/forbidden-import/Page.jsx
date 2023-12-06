export default Page

import React from 'react'
import ClientOnly from './ClientOnly.client'

function Page() {
  return (
    <div>
      <ClientOnly />
      <h1>This is page for forbidden import.</h1>
    </div>
  )
}
