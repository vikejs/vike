import React from 'react'
import { Counter } from './Counter'

export default { Page }

function Page() {
  return (
    <>
      <h1>Vite-plugin-ssr + Stem React</h1>
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
