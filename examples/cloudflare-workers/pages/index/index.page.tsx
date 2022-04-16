import React, { Suspense } from 'react'
// @ts-expect-error: React 18 types aren't ready yet
import { useId } from 'react'
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
        setTimeout(() => resolve('Hello ' + Math.random()), 5000)
      }),
  )
  console.log('val: ' + val)
  return <p>{val}, I was lazy</p>
}

type AsyncData = { progress: 'NOT_STARTED' } | { progress: 'DONE'; value: unknown }

function useAsync(asyncFn: () => Promise<unknown>) {
  const id: string = useId()
  const { get, set } = useSsrData<AsyncData>()
  const data = get(id)
  console.log('id: ', id)
  console.log('data: ', data)
  if (data?.progress === 'DONE') {
    return data.value
  }
  if (data?.progress === 'NOT_STARTED') {
    throw new Error('Only one `useAsync()` hook can be used per component')
  }
  set(id, { progress: 'NOT_STARTED' })

  let promise = asyncFn()
  console.log('THROW')
  throw (async () => {
    console.log('PROMISE start')
    const value = await promise
    console.log('PROMISE resolve')
    set(id, { progress: 'DONE', value })
  })()
  //throw new Error('Something unexpected happened ' + JSON.stringify(state))
}
