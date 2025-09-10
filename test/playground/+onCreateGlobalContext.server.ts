export { onCreateGlobalContext }

import type { GlobalContextServer } from 'vike/types'
import { assert } from './utils/assert'

async function onCreateGlobalContext(globalContext: GlobalContextServer) {
  assert(globalContext.config.redirects![0]!['/mail'])
  const rid = Math.ceil(Math.random() * Math.pow(10, 14))
  globalContext.setGloballyServer = `server-random-number:${rid}`
  globalContext.notPassedToClient = 123
}

declare global {
  namespace Vike {
    interface GlobalContext {
      // Passed to client
      setGloballyServer: string
    }
    interface GlobalContextServer {
      notPassedToClient: number
    }
  }
}
