import React from 'react'
import { Counter } from '../components/Counter'

export default IndexPage

function IndexPage() {
  return (
    <>
      <h1>Welcome</h1>
      Welcome to <code>vite-plugin-ssr</code>.
      <ul>
        <li>This page is rendered to HTML.</li>
        <li>
          This page is interactive: <Counter />
        </li>
      </ul>
    </>
  )
}
