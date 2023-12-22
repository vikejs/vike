export default Page

import React from 'react'
import { navigate } from 'vike/client/router'
import { Counter } from '../../components/Counter'

function Page() {
  return (
    <>
      <h1>Welcome to Vike</h1>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
      <p>
        <button
          onClick={() => {
            const randomIndex = Math.floor(Math.random() * 3)
            navigate(['/markdown', '/star-wars', '/hello/alice'][randomIndex])
          }}
        >
          Random Page
        </button>
      </p>
    </>
  )
}
