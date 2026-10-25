export default Page

import React from 'react'
import { Counter } from '../index/Counter'

function Page() {
  return (
    <>
      <h1>Abort navigation</h1>
      <p>Leaving this page asks for confirmation, see `+onPageTransitionStart.ts`.</p>
      <Counter />
    </>
  )
}
