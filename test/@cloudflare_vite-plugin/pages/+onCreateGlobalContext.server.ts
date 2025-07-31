export { onCreateGlobalContext }

import type { GlobalContextServer } from 'vike/types'
// @ts-ignore
import { env } from 'cloudflare:workers'

async function onCreateGlobalContext(globalContext: GlobalContextServer) {
  // @ts-ignore
  globalContext.someEnvVar = env['SOME_ENV_VAR']
}

declare global {
  namespace Vike {
    interface GlobalContext {
      // Passed to client
      someEnvVar: string
    }
  }
}
