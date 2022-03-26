// This file is processed by Vite; the path alias `#root` is
// defined in `vite.config.js#resolve.alias`.
import { Counter } from '#root/components/Counter'
import React from 'react'

export { Page }

function Page() {
  return (
    <p>
      Interactive: <Counter />
    </p>
  )
}
