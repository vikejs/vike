export default { Page }

import React from 'react'
import { navigate } from 'vite-plugin-ssr/client/router'
import { Counter } from '../components/Counter'

function Page() {
  return (
    <>
      <h1>
        Welcome to <code>vite-plugin-ssr</code>
      </h1>
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
            const url = ['/markdown', '/star-wars', '/hello/alice'][randomIndex]
            navigate(url, { keepScrollPosition: true })
          }}
        >
          Random Page
        </button>
      </p>
    </>
  )
}
