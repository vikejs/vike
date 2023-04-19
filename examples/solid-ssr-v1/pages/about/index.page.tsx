export { Page }

import type { Component } from 'solid-js'
import './code.css'

const Page: Component = () => {
  return (
    <>
      <h1>About</h1>
      <p>
        Demo using <code>vite-plugin-ssr</code> with Solid.
      </p>
    </>
  )
}
