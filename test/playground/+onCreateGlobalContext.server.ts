export { onCreateGlobalContext }

import type { GlobalContextServer } from 'vike/types'
import { assert } from './utils/assert'

async function onCreateGlobalContext(globalContext: GlobalContextServer) {
  assert(globalContext.config.redirects![0]!['/mail'])
  globalContext.setGloballyServer = Math.ceil(Math.random() * Math.pow(10, 14))
  globalContext.notPassedToClient = 123
}

declare global {
  namespace Vike {
    interface GlobalContext {
      // Passed to client
      setGloballyServer: number
    }
    interface GlobalContextServer {
      notPassedToClient: number
    }
  }
}
