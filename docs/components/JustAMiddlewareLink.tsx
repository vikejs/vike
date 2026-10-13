export { JustAMiddlewareLink }

import React from 'react'
import { Link } from '@brillout/docpress'

function JustAMiddlewareLink() {
  return (
    <>
      From the perspective of the server, Vike is{' '}
      <Link href="/server#get-started">just a server middleware `vike(app)`</Link>.
    </>
  )
}
