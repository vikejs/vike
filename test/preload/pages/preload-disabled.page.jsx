export { Page }
export const preloadStrategy = 'DISABLED'

import React from 'react'

function Page() {
  return (
    <>
      <h1>Disabled</h1>
      <p>This page showcases completely disabled preloading: the image nor the font are preloaded.</p>
    </>
  )
}
