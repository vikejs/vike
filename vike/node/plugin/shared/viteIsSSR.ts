export { viteIsSSR }
export { viteIsSSR_options }
export { viteIsSSR_safe }

import type { ResolvedConfig, UserConfig } from 'vite'
import { assert } from '../../../utils/assert.js'

function viteIsSSR(config: ResolvedConfig | UserConfig): boolean {
  return !!config?.build?.ssr
}

function viteIsSSR_options(options: undefined | { ssr?: boolean }): boolean {
  return !!options?.ssr
}

// Vite is quite a mess about properly setting `ssr: boolean`, thus we use an extra safe implemention for security purposes.
// It's used for .client.js and .server.js guarantee thus we use agressive assert() calls for added safety
function viteIsSSR_safe(config: ResolvedConfig, options: { ssr?: boolean } | undefined): boolean {
  const isBuild = config.command === 'build'
  if (isBuild) {
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
