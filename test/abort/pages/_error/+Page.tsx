export default Page

import React from 'react'
import { usePageContext } from '../../renderer/usePageContext'
import { assert } from '../../utils/assert'
import { Counter } from '../index/Counter'

function Page() {
  const pageContext = usePageContext()
  assert(Array.isArray(pageContext.pageContextsAborted))

  // throw render()
  if (pageContext.abortReason) {
    const { length } = pageContext.pageContextsAborted
    if (pageContext.isHydration) {
      // The aborted pageContext isn't available since it was created on the server-side, see https://vike.dev/pageContext#pageContextsAborted
      assert(length === 0)
    } else {
      assert(length > 0)
    }
  }

  let { is404, abortReason, abortStatusCode } = pageContext
  if (!abortReason) {
    abortReason = is404 ? 'Page not found.' : 'Something went wrong.'
  }
  return (
    <Center>
      <div>
        <h1>{abortStatusCode}</h1>
        <p style={{ fontSize: '1.3em' }}>{abortReason}</p>
        <Counter />
      </div>
    </Center>
  )
}

function Center({ style, ...props }: any) {
  return (
    <div
      style={{
        height: 'calc(100vh - 100px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}
      {...props}
    ></div>
  )
}
