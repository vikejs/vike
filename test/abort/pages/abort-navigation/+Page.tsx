export default Page

import React from 'react'
import { Counter } from '../index/Counter'

function Page() {
  return (
    <>
      <h1>Abort navigation</h1>
      <p>Client-side navigation to this page is aborted by `throw abort()` in the guard() hook.</p>
      <Counter />
    </>
  )
}
