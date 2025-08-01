export { onCreateGlobalContext }

import type { GlobalContextServer } from 'vike/types'
// @ts-ignore
// import { env } from 'cloudflare:workers'
// console.log('env 1', env)

// TODO/now make it work or replace with +onCreatePageContext.server.js
// TODO/now add test (copy from it)

async function onCreateGlobalContext(globalContext: GlobalContextServer) {
  console.log('+onCreateGlobalContext()')
  // @ts-ignore
  const { env } = await import('cloudflare:workers')
  console.log('env 2', env)
  console.log("env['SOME_ENV_VAR']", env['SOME_ENV_VAR'])
  globalContext.someEnvVar = env['SOME_ENV_VAR']
  console.log('globalContext.someEnvVar', globalContext.someEnvVar)
}

declare global {
  namespace Vike {
    interface GlobalContext {
      // Passed to client
      someEnvVar: string
    }
  }
}
