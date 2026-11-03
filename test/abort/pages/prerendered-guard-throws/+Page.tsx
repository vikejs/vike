export default Page

import React from 'react'

function Page() {
  return <p>I'm never shown upon client-side navigation since the guard() hook throws an error.</p>
}
