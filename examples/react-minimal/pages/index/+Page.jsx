export default Page

import React from 'react'
import { Counter } from './Counter'
import { isDev } from 'is-dev'

console.log('isDev', isDev)

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
    </>
  )
}
