export default Page

import React from 'react'

// TEST: the page's code throws while it's loaded on the client-side
if (!import.meta.env.SSR) throw new Error('The page failed to load (on purpose)')

function Page() {
  return <p>Server-side rendered page whose client-side code fails to load.</p>
}
