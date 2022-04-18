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
  // console.log('LazyComponent')
  const val = useAsync(
    () =>
      new Promise((resolve) => {
        setTimeout(() => resolve('Hello ' + Math.random()), 5 * 1000)
      }),
  )
  // console.log('val: ',val)
  return <p>{val}, I was lazy</p>
}

function useAsync(asyncFn: () => Promise<unknown>) {
  const id: string = useId()
  // TODO: throw new Error('Only one `useAsync()` hook can be used per component')
  return useSsrData(id, async() => {
    const value = await asyncFn()
    return value
  })
}
