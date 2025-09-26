export { onCreateGlobalContext }

import type { GlobalContextClient } from 'vike/types'
import { assert } from './utils/assert'

async function onCreateGlobalContext(globalContext: GlobalContextClient) {
  assert(globalContext.pages['/pages/index'])
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
