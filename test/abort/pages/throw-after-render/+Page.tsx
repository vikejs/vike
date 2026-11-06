export default Page

import React, { useEffect, useState } from 'react'
import { render } from 'vike/abort'
import { prefetch } from 'vike/client/router'
import { Counter } from '../index/Counter'

function Page() {
  const [shouldThrow, setShouldThrow] = useState(false)
  useEffect(() => {
    if (location.search === '?late-after-prefetch') prefetch('/about').then(() => setShouldThrow(true))
    else if (location.search) setTimeout(() => setShouldThrow(true), 100)
  }, [])
  if (shouldThrow)
    throw location.search === '?render-url' ? render('/does-not-exist') : new Error('Thrown after render')
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
