export default Page

import React from 'react'

function Page() {
  return <p>I'm never shown since the guard() hook executes `throw render(401)`.</p>
}
