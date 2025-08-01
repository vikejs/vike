export { onCreateGlobalContext }

import type { GlobalContextServer } from 'vike/types'

async function onCreateGlobalContext(globalContext: GlobalContextServer) {
  let cloudflare: { env: Cloudflare.Env }
  if (import.meta.env.DEV) {
    const { getPlatformProxy } = await import('wrangler')
    cloudflare = (await getPlatformProxy()) as any
  } else {
    cloudflare = await import('cloudflare:workers')
  }
  globalContext.cloudflare = cloudflare
  globalContext.someEnvVar = cloudflare.env['SOME_ENV_VAR']
}

declare global {
  namespace Vike {
    interface GlobalContextServer {
      cloudflare: { env: Cloudflare.Env }
    }
    interface GlobalContext {
      // Passed to client
      someEnvVar: string
    }
  }
}
