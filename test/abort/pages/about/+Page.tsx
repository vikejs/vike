export default Page

import React from 'react'
import { Counter } from '../index/Counter'

function Page() {
  return (
    <>
      <h1>About</h1>
      <p>Showcases render aborts.</p>
      <Counter />
    </>
  )
}
