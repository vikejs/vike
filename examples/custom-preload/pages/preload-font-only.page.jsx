export { Page }
export const preloadStrategy = 'ONLY_FONT'

import React from 'react'

function Page() {
  return (
    <>
      <h1>Font Only</h1>
      <p>This page showcases a custom strategy of only preloading the font (i.e. the image isn't preloaded).</p>
    </>
  )
}
