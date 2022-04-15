import React, { Suspense, useState, useId } from 'react'
import { Counter } from './Counter'
import { useSsrData } from '../../renderer/useSsrData'

export { Page }

function Page() {
  const id = useId()
  console.log('useId: '+id)
  //console.log('id1: ' + useId())
  return (
    <>
    <span>{id}</span>
      <h1>Welcome</h1>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
    {/*
      <Suspense fallback={<p>Loading...</p>}>
        <LazyComponent />
      </Suspense>
     */}
    </>
  )
}

function LazyComponent() {
  //console.log('id2: ' + useId())
  //const [count, setCount] = useState(0);
  //setCount(count+1);
  //console.log(count)
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
  let state = useSsrData()
  state.progress = state.progress || 'NOT_STARTED'
  let setState = s => {
    Object.assign(state, s);
  }
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
