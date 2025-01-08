export default Page

import React from 'react'
import { Counter } from './Counter.client'
import { secret } from './secret.server'

function Page() {
  return (
    <>
      <h1>Test page</h1>
      <div>Secret: {secret}</div>
      <Counter />
    </>
  )
}
