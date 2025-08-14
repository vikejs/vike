export { Counter }

import React from 'react'
import { useCounterStore } from '../store'

function Counter() {
  const { counter, setCounter } = useCounterStore()

  return <button onClick={() => setCounter(counter + 1)}>Counter {counter}</button>
}
