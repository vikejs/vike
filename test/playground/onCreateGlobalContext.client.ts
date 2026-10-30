export { onCreateGlobalContext }

import type { GlobalContextClient } from 'vike/types'
import { assert } from './utils/assert'
// TEST: a global client hook can import `vike/client/router` (without circular dependency between chunks)
import { navigate } from 'vike/client/router'

async function onCreateGlobalContext(globalContext: GlobalContextClient) {
  assert(globalContext.pages['/pages/index'])
  assert(typeof navigate === 'function')
  const rid = Math.ceil(Math.random() * Math.pow(10, 14))
  globalContext.setGloballyClient = `client-random-number:${rid}`
}

declare global {
  namespace Vike {
    interface GlobalContextClient {
      setGloballyClient: string
    }
    interface GlobalContextServer {
      setGloballyClient?: undefined
    }
  }
}
