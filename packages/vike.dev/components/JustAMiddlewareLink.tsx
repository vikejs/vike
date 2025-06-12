export { JustAMiddlewareLink }

import React from 'react'
import { Link } from '@brillout/docpress'

function JustAMiddlewareLink() {
  return (
    <>
      From the perspective of the server, Vike is{' '}
      <Link text="just a server middleware" href="/integration#server-side-tools" />.
    </>
  )
}
