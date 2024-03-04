export default Page
import React from 'react'
import { onCreateImage } from './Page.telefunc'

function Page() {
  return (
    <>
      <h1>Example of sharp</h1>
      <button
        onClick={async () => {
          await onCreateImage()
        }}
      >
        Run sharp
      </button>
    </>
  )
}
