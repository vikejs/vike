export default Page

import React from 'react'
import { Counter } from '../../components/Counter'

function Page() {
  return (
    <>
      <h1>SPA</h1>
      <p>This page isn't server-side rendered.</p>
      <Counter />
    </>
  )
}
