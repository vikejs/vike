export default Page

import React from 'react'
import { Counter } from '../../components/Counter'

function Page() {
  // Will be printed only in the browser:
  console.log('Rendering page without SSR')

  return (
    <>
      <h1>Without SSR</h1>
      This page is rendered only in the browser:
      <ul>
        <li>
          It's interactive. <Counter />
        </li>
        <li>It isn't rendered to HTML.</li>
      </ul>
    </>
  )
}
