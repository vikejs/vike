export { JustAMiddlewareLink }

import React from 'react'
import { Link } from '@brillout/docpress'

function JustAMiddlewareLink() {
  return (
    <>
      From the perspective of the server, Vike is{' '}
      <Link href="/integration#server-manual-integration">just a server middleware</Link>.
    </>
  )
}
