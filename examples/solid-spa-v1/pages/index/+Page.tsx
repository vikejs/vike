import type { Component } from 'solid-js'
import { Counter } from './Counter'

const Page: Component = () => {
  return (
    <>
      <h1>About</h1>
      <p>Solid JS SPA</p>
      <Counter></Counter>
    </>
  )
}
export default Page
