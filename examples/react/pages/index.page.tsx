import React from 'react'
import { Counter } from '../components/Counter'

export default IndexPage

function IndexPage() {
  return (
    <>
      <h1>Welcome</h1>
      To <code>vite-plugin-ssr</code>. This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive: <Counter />.
        </li>
      </ul>
    </>
  )
}
