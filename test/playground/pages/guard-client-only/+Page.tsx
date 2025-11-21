export { Page }

import { assert } from '../../utils/assert'
import React from 'react'

function Page() {
  // Never rendered on the client-side because of +guard.client.ts
  assert(import.meta.env.SSR)
  return <>I am only rendered on the server-side.</>
}
