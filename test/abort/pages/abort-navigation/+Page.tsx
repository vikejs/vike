export default Page

import React from 'react'

function Page() {
  return <p>Client-side navigation to this page is aborted by `throw Abort()` in the guard() hook.</p>
}
