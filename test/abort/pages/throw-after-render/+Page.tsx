export default Page

import React, { useEffect, useState } from 'react'
import { redirect, render } from 'vike/abort'
import { handleError, prefetch } from 'vike/client/router'
import { Counter } from '../index/Counter'
import { usePageContext } from '../../renderer/usePageContext'

function Page() {
  const pageContext = usePageContext()
  const [shouldThrow, setShouldThrow] = useState(false)
  useEffect(() => {
    if (location.search === '?late-after-prefetch') {
      prefetch('/about').then(() => setShouldThrow(true))
    } else if (location.search === '?throw-on-leave') {
      // E.g. a fetch() aborted by pageContext.abortSignal
      pageContext.abortSignal.addEventListener('abort', () => setShouldThrow(true))
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
      <button id="redirect-self" onClick={() => handleError(redirect('/throw-after-render'))}>
        Hand over redirect() to this page
      </button>
      <button
        id="value-after-error-page"
        onClick={async () => {
          await handleError(new Error('First value'))
          // The error page is shown
          await handleError(render(404))
          console.log('handleError() settled')
        }}
      >
        Hand over a value once the error page is shown
      </button>
      <Counter />
    </>
  )
}

function getThrown() {
  if (location.search === '?render-url') return render('/does-not-exist')
  if (location.search === '?render-about') return render('/about')
  if (location.search === '?redirect-html-only') return redirect('/html-only')
  return new Error('Thrown after render')
}
