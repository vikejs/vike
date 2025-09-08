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
            const target = ['/markdown', '/star-wars', '/hello/alice']
            const randomIndex = Math.floor(Math.random() * target.length)
            navigate(target[randomIndex])
          }}
        >
          Random Page
        </button>
      </p>
    </>
  )
}
