export { Counter }

import React, { useState } from 'react'
import { LocaleText } from '../renderer/LocaleText'

function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button type="button" onClick={() => setCount((count) => count + 1)}>
      <LocaleText>Counter</LocaleText> {count}
    </button>
  )
}
