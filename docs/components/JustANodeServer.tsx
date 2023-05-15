export { JustANodeServer }

import React from 'react'
import { Link } from '@brillout/docpress'

function JustANodeServer() {
  return (
    <p>
      From a server architecture point of view, vite-plugin-ssr app is{' '}
      <Link text="just a middleware" href="/integration#server-side-tools" />.
    </p>
  )
}
