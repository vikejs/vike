export default Page

import React from 'react'
import type { PageContext } from 'vike/types'

function Page({ guardExecuted, guardExecutedOn }: PageContext) {
  return (
    <div>
      <h1>About Page</h1>
      <p>Guard executed: {guardExecuted ? 'Yes' : 'No'}</p>
      <p>Guard executed on: {guardExecutedOn || 'Unknown'}</p>
      <a href="/">Go to Home</a>
    </div>
  )
}
