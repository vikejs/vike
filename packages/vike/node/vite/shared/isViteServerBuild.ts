export { isViteServerBuild }
export { isViteClientBuild }
export { isViteServerBuild_options }
export { isViteServerBuild_safe }
export { isViteServerBuild_onlySsrEnv }

import type { Environment, ResolvedConfig, UserConfig } from 'vite'
import { assert } from '../../../utils/assert.js'

function isViteServerBuild(configGlobal: ResolvedConfig | UserConfig, viteEnv?: Environment): boolean {
  const configEnv = viteEnv?.config ?? configGlobal
  return !!configEnv?.build?.ssr
}
// Only `ssr` env: for example don't include `vercel_edge` nor `vercel_node`.
function isViteServerBuild_onlySsrEnv(configGlobal: ResolvedConfig, viteEnv: Environment | undefined) {
  return viteEnv ? viteEnv.name === 'ssr' : isViteServerBuild(configGlobal)
}
function isViteClientBuild(configGlobal: ResolvedConfig, viteEnv: Environment) {
  const yes = !isViteServerBuild(configGlobal, viteEnv)
  const isVite5 = viteEnv === undefined
  if (!isVite5) {
    const yes2 = viteEnv.name === 'client'
    assert(yes === yes2)
  }
  return yes
}

function isViteServerBuild_options(options: { ssr?: boolean } | undefined): boolean {
  return !!options?.ssr
}

// Vite is quite messy about setting `ssr: boolean`, thus we use an extra safe implementation for security purposes.
// It's used for .client.js and .server.js guarantee thus we use aggressive assert() calls for added safety.
function isViteServerBuild_safe(config: ResolvedConfig, options: { ssr?: boolean } | undefined): boolean {
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
