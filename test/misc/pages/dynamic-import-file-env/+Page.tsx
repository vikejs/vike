import React from 'react'
import { isBrowser } from './isBrowser'

if (isBrowser) import('./hello.client')

export function Page() {
  return (
    <>
      <p>dyanmic import() of .client.js file</p>
    </>
  )
}
