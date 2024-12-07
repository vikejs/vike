import React from 'react'
import { isBrowser } from '../isBrowser'

if (isBrowser) {
  import('./hello.client')
} else {
  import('./hello.server')
}

export function Page() {
  return (
    <>
      <p>Dyanmic import() of .client.js and .server.js</p>
    </>
  )
}
