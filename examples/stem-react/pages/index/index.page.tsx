import React from 'react'
import { Counter } from './Counter'

export default { Page }

function Page() {
  return (
    <>
      <h1>Vike + Stem React</h1>
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
