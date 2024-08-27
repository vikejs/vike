export default Page
import React, { useState } from 'react'
import { onCreateImage } from './Page.telefunc'

function Page() {
  const [byteLength, setByteLength] = useState(0)
  return (
    <>
      <h1>Example of sharp</h1>
      <button
        type="button"
        onClick={async () => {
          setByteLength(await onCreateImage())
        }}
      >
        Run sharp
      </button>
      <p>{byteLength} bytes</p>
    </>
  )
}
