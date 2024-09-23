// Test: define `Page` over `+config.js > export default { Page }` instead of +Page.js

export default Page

import React from 'react'

function Page() {
  return (
    <>
      <h1>About</h1>
      <p>Example of using Vike.</p>
    </>
  )
}
