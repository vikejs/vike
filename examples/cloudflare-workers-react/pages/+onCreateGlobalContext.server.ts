export { onCreateGlobalContext }

import type { GlobalContextServer } from 'vike/types'

// TODO/now make it work or replace with +onCreatePageContext.server.js
// TODO/now add test (copy from it)

async function onCreateGlobalContext(globalContext: GlobalContextServer) {
  let env: Record<string, string>
  if (import.meta.env.DEV) {
    const { getPlatformProxy } = await import('wrangler')
    const proxy = await getPlatformProxy()
    env = proxy.env as any
  } else {
    // @ts-ignore
    const exportsAll = await import('cloudflare:workers')
    env = exportsAll.env
  }
  globalContext.someEnvVar = env['SOME_ENV_VAR']
  // TODO/now remove
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
