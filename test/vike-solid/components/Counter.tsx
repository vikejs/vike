import { createSignal } from 'solid-js'

export function Counter() {
  const [count, setCount] = createSignal(0)
  return <button onClick={() => setCount((count) => count + 1)}>Counter {count()}</button>
}
