export { JustAMiddlewareLink }

import React from 'react'
import { Link } from '@brillout/docpress'

function JustAMiddlewareLink() {
  return (
    <>
      From the perspective of the server, vite-plugin-ssr app is{' '}
      <Link text="just a middleware" href="/integration#server-side-tools" />.
    </>
  )
}
