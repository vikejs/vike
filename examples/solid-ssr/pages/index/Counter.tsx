import { Component, createSignal } from 'solid-js'

export { Counter }

const Counter: Component = () => {
  const [count, setCount] = createSignal(0)
  return (
    <button type="button" onClick={() => setCount((prev) => prev + 1)}>
      Counter {count()}
    </button>
  )
}
