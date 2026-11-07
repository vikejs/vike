export default Page

import React, { useEffect, useState } from 'react'
import { redirect, render } from 'vike/abort'
import { prefetch } from 'vike/client/router'
import { Counter } from '../index/Counter'

function Page() {
  const [shouldThrow, setShouldThrow] = useState(false)
  useEffect(() => {
    if (location.search === '?late-after-prefetch') {
      prefetch('/about').then(() => setShouldThrow(true))
    } else if (
      location.search &&
      // The +client.ts file hands over the values of `?two-values`
      location.search !== '?two-values'
    ) {
      setTimeout(() => setShouldThrow(true), 100)
    }
  }, [])
  if (shouldThrow) throw getThrown()
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

function getThrown() {
  if (location.search === '?render-url') return render('/does-not-exist')
  if (location.search === '?render-about') return render('/about')
  if (location.search === '?redirect-html-only') return redirect('/html-only')
  if (location.search === '?null') return null
  return new Error('Thrown after render')
}
