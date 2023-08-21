export default Page

import React, { useState } from 'react'
import { usePageContext } from '../../renderer/usePageContext'

function Page() {
  const pageContext = usePageContext()
  const { onBeforeRender1WasCalled, onBeforeRender2WasCalled, onBeforeRenderEnv } = pageContext
  return (
    <>
      <h1>Page</h1>
      <p>onBeforeRender() 1 called: {String(onBeforeRender1WasCalled)}</p>
      <p>onBeforeRender() 2 called: {String(onBeforeRender2WasCalled)}</p>
      <p>onBeforeRender() env: {String(onBeforeRenderEnv)}</p>
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
