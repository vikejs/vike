export default Page

import React from 'react'

function Page() {
  return (
    <div>
      <h1>Guard Client Only Test</h1>
      <p>This page should never be reached because the guard always throws render().</p>
      <p>If you see this page, the guard is not working correctly.</p>
      <div>
        <a href="/">Go to Home</a>
      </div>
    </div>
  )
}
