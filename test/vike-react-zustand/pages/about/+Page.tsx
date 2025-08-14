export default Page

import React from 'react'
import { Counter } from '../../components/Counter'

function Page() {
  return (
    <>
      <>
        <h1>About</h1>
        <p>The counter value is the same as on the Welcome page.</p>
        <Counter />
      </>
    </>
  )
}
