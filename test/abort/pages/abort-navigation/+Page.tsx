export default Page

import React, { useEffect } from 'react'
import { Counter } from '../index/Counter'

function Page() {
  // Leaving this page asks for confirmation, see /renderer/+onBeforeRoute.client.ts
  useEffect(() => {
    ;(window as any).hasUnsavedChanges = true
    return () => {
      ;(window as any).hasUnsavedChanges = false
    }
  }, [])
  return (
    <>
      <h1>Abort navigation</h1>
      <Counter />
    </>
  )
}
