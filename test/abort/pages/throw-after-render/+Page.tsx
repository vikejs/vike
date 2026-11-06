export default Page

import React, { useState } from 'react'
import { Counter } from '../index/Counter'

function Page() {
  const [shouldThrow, setShouldThrow] = useState(false)
  if (shouldThrow) throw new Error('Thrown after render')
  return (
    <>
      <h1>Throw after render</h1>
      <button id="throw" onClick={() => setShouldThrow(true)}>
        Throw
      </button>
      <Counter />
    </>
  )
}
