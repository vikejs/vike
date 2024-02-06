export { ViteLazyTranspilingContradiction }

import { Link } from '@brillout/docpress'

import React from 'react'

function ViteLazyTranspilingContradiction() {
  return (
    <>
      contradicts <Link href="/lazy-transpiling">Vite's lazy-transpiling approach</Link> and, therefore, significantly
      slows down development speed
    </>
  )
}
