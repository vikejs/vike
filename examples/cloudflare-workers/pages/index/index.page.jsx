import React, { Suspense, useId } from 'react'
import { Counter } from './Counter'
import { useSsrData } from '../../renderer/useSsrData'

export { Page }

function Page() {
  return (
    <>
      <h1>Welcome</h1>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
      <Suspense fallback={<p>Loading...</p>}>
        <LazyComponent />
      </Suspense>
    </>
  )
}

function LazyComponent() {
  const val = useAsync(
    () =>
      new Promise((resolve) => {
        setTimeout(() => resolve('Hello '+Math.random()), 5000)
      }),
  )
  console.log('val: '+val)
  return <p>{val}, I was lazy</p>
}

function useAsync(asyncFn) {
  const id = useId()
  const ssrData = useSsrData()
  const state = ssrData[id] = ssrData[id] ?? { progress: 'NOT_STARTED' }
  let setState = s => {
    // const state = ssrData[id] = ssrData[id] ?? {}
    Object.assign(state, s);
  }
  console.log('id: ', id)
  console.log('state: ',state)

  const { progress } = state
  if (progress === 'NOT_STARTED') {
    let promise = asyncFn()
    throw (async () => {
      console.log('PROMISE start')
      const value = await promise
      console.log('PROMISE resolve')
      setState({ progress: 'DONE', value })
      //console.log('promise value: ' + value)
    })()
  }
  if (progress === 'DONE') {
    return state.value
  }
  // if( progress === 'PENDING' ){ }
  throw new Error('Something unexpected happened ' + JSON.stringify(state))
}
