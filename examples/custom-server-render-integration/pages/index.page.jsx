import { useState } from 'react'
import './index.css'

export { Page }

function Page() {
  return (
    <>
      I am rendered to HTML and interactive: <Counter />.
    </>
  )
}

function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount((count) => count + 1)}>
      Count: <span>{count}</span>
    </button>
  )
}
