export default Page

import React, { useEffect } from 'react'
import { Counter } from '../index/Counter'
import { setUnsavedChanges } from '../../renderer/unsavedChanges'

function Page() {
  // Reset when the user leaves the page
  useEffect(() => () => setUnsavedChanges(false), [])
  return (
    <>
      <h1>Unsaved changes</h1>
      <label>
        <input type="checkbox" onChange={(ev) => setUnsavedChanges(ev.target.checked)} /> Unsaved changes
      </label>
      <Counter />
    </>
  )
}
