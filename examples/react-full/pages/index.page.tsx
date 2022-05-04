import React from 'react'
import { navigate } from 'vite-plugin-ssr/client/router'
import { Counter } from '../components/Counter'

export default { Page }

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
        We <code>export const clientRouting = true</code> to enable Client Routing.{' '}
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
