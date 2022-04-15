import React, { useState, useId } from 'react'

export { Counter }

function Counter() {
  const id = useId()
  console.log('id :'+ id)
  const [count, setCount] = useState(0)

  return <button onClick={() => setCount((count) => count + 1)}>{id} Counter {count}</button>
}
