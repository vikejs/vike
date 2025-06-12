export default Page

import React, { useState } from 'react'
import type { GlobalData, PerPageData } from '../../renderer/types'
import { usePageContext } from '../../renderer/usePageContext'
import { useData } from '../../renderer/useData'

function Page() {
  const pageContext = usePageContext()
  const {
    globalOnBeforeRenderWasCalled,
    globalOnBeforeRenderWasCalledInEnv,
    perPageOnBeforeRenderWasCalled,
    perPageOnBeforeRenderWasCalledInEnv,
  } = pageContext
  const data = useData<GlobalData & PerPageData>() || {}
  const { globalDataWasCalled, globalDataWasCalledInEnv, perPageDataWasCalled, perPageDataWasCalledInEnv } = data
  return (
    <>
      <h1>Page</h1>
      <p>global data() was called: {String(globalDataWasCalled)}</p>
      <p>global data() was called in env: {String(globalDataWasCalledInEnv)}</p>
      <p>per-page data() was called: {String(perPageDataWasCalled)}</p>
      <p>per-page data() was called in env: {String(perPageDataWasCalledInEnv)}</p>
      <p>global onBeforeRender() was called: {String(globalOnBeforeRenderWasCalled)}</p>
      <p>global onBeforeRender() was called in env: {String(globalOnBeforeRenderWasCalledInEnv)}</p>
      <p>per-page onBeforeRender() was called: {String(perPageOnBeforeRenderWasCalled)}</p>
      <p>per-page onBeforeRender() was called in env: {String(perPageOnBeforeRenderWasCalledInEnv)}</p>
      <Counter />
    </>
  )
}

function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button type="button" onClick={() => setCount((count) => count + 1)}>
      Counter {count}
    </button>
  )
}
