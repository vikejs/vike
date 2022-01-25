import React from 'react'
import { Counter } from './Counter'

export { Page }

function Page() {
  return (
    <>
      <h1>Demo: SPA</h1>
      <ul>
        <li>
          Is the page's text renderered to HTML? <b>No</b>, see "View page source".
        </li>
        <li>
          Is the page interactive? <b>Yes</b>, counter is working: <Counter />.
        </li>
      </ul>
    </>
  )
}
