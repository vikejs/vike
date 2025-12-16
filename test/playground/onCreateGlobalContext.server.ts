export { onCreateGlobalContext }

import type { GlobalContextServer } from 'vike/types'
import { assert } from './utils/assert'

async function onCreateGlobalContext(globalContext: GlobalContextServer) {
  assert(import.meta.env.SOME_ENV_VAR === '123')
  assert(process.env.SOME_ENV_VAR === '123')
  assert(globalContext.config.redirects![0]!['/mail'])
  const rid = Math.ceil(Math.random() * Math.pow(10, 14))
  globalContext.setGloballyServer = `server-random-number:${rid}`
  globalContext.notPassedToClient = 123
  globalContext.someDate = new Date('2025')
}

declare global {
  namespace Vike {
    interface GlobalContext {
      // Passed to client
      setGloballyServer: string
      someDate: Date
    }
    interface GlobalContextServer {
      notPassedToClient: number
    }
  }
}
