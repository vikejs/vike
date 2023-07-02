export default Page

import React from 'react'
import { Counter } from './Counter'

function Page() {
  return (
    <>
      <h1>Welcome</h1>
      <ul>
        <li>PUBLIC_ENV: {import.meta.env.PUBLIC_ENV}</li>
        <li>SOME_ENV: {import.meta.env.SOME_ENV}</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
    </>
  )
}
