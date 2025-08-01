export { onCreateGlobalContext }

import type { GlobalContextServer } from 'vike/types'

async function onCreateGlobalContext(globalContext: GlobalContextServer) {
  let cloudflare: Cloudflare
  if (import.meta.env.DEV) {
    const { getPlatformProxy } = await import('wrangler')
    cloudflare = (await getPlatformProxy()) as any
  } else {
    cloudflare = await import('cloudflare:workers')
  }
  globalContext.cloudflare = cloudflare
  globalContext.someEnvVar = cloudflare.env['SOME_ENV_VAR']
}

type Cloudflare = {
  env: Cloudflare.Env
}

declare global {
  namespace Vike {
    interface GlobalContextServer {
      cloudflare: Cloudflare
    }
    interface GlobalContext {
      // Passed to client
      someEnvVar: string
    }
  }
}
