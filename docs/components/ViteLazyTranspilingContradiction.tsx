export { ViteLazyTranspilingContradiction }

import { Link } from '@brillout/docpress'

import React from 'react'

function ViteLazyTranspilingContradiction() {
  return (
    <>
      which would contradict <Link href="/lazy-transpiling">Vite's lazy-transpiling approach</Link> and would therefore
      siginficantly slow down the dev's DX speed
    </>
  )
}
