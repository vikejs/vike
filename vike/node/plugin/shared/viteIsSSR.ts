export { viteIsSSR }
export { viteIsServerBuildEnvAny }
export { viteIsSSR_options }
export { viteIsSSR_safe }

import type { Environment, ResolvedConfig, UserConfig } from 'vite'
import { assert } from '../../../utils/assert.js'

function viteIsSSR(configGlobal: ResolvedConfig | UserConfig, viteEnv?: Environment): boolean {
  const configEnv = viteEnv?.config ?? configGlobal
  return !!configEnv?.build?.ssr
}
// All server-side environments: not only `ssr` but, for example, also `vercel_edge` and `vercel_node`.
function viteIsServerBuildEnvAny(configGlobal: ResolvedConfig, viteEnv: Environment | undefined) {
  return viteEnv ? viteEnv.name === 'ssr' : viteIsSSR(configGlobal)
}

function viteIsSSR_options(options: { ssr?: boolean } | undefined): boolean {
  return !!options?.ssr
}

// Vite is quite messy about setting `ssr: boolean`, thus we use an extra safe implemention for security purposes.
// It's used for .client.js and .server.js guarantee thus we use agressive assert() calls for added safety.
function viteIsSSR_safe(config: ResolvedConfig, options: { ssr?: boolean } | undefined): boolean {
  if (config.command === 'build') {
    assert(typeof config.build.ssr === 'boolean')
    const val = config.build.ssr
    if (options?.ssr !== undefined) assert(val === options.ssr)
    return val
  } else {
    assert(typeof options?.ssr === 'boolean')
    const val = options.ssr
    /* This assert() fails (which is very unexpected).
    if (typeof config.build.ssr === 'boolean') assert(val === config.build.ssr)
    //*/
    return val
  }
}
