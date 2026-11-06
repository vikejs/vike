export default Page

import React, { useEffect, useState } from 'react'
import { Counter } from '../index/Counter'

function Page() {
  const [shouldThrow, setShouldThrow] = useState(false)
  useEffect(() => {
    if (location.search === '?late') setTimeout(() => setShouldThrow(true), 100)
  }, [])
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
