import React from 'react'
import { Counter } from './Counter'

export { Page }

function Page() {
  return (
    <>
      <h1>Demo: HTML-only</h1>
      <ul>
        <li>
          Is the page's text renderered to HTML? <b>Yes</b>, see "View page source".
        </li>
        <li>
          Is the page interactive? <b>No</b>, counter is not working: <Counter />.
        </li>
      </ul>
    </>
  )
}
