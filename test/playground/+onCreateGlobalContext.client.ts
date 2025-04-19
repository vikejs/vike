export { onCreateGlobalContext }

import type { GlobalContextClient } from 'vike/types'
import { assert } from './utils/assert'

async function onCreateGlobalContext(globalContext: GlobalContextClient) {
  assert(globalContext.pages['/pages/index'])
  globalContext.setGloballyClient = Math.ceil(Math.random() * Math.pow(10, 14))
}

declare global {
  namespace Vike {
    interface GlobalContextClient {
      setGloballyClient: number
    }
    interface GlobalContextServer {
      setGloballyClient?: undefined
    }
  }
}
