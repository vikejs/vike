export default Page

import React from 'react'

function Page() {
  return <p>I will never be shown because of throw renderUrl() in the guard() hook.</p>
}
