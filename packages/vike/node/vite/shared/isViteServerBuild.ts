export { isViteServerBuild }
export { isViteClientBuild }
export { isViteServerBuild_options }
export { isViteServerBuild_safe }
export { isViteServerBuild_onlySsrEnv }

import type { Environment, EnvironmentOptions, ResolvedConfig, UserConfig } from 'vite'
import { assert } from '../../../utils/assert.js'

type ViteEnv = { name: string; config: EnvironmentOptions | Environment['config'] }

function isViteServerBuild(configGlobal: ResolvedConfig | UserConfig, viteEnv: ViteEnv | undefined): boolean {
  const configEnv = viteEnv?.config ?? configGlobal
  const res = !!configEnv?.build?.ssr
  assert_isViteServerBuild(res, configGlobal, viteEnv)
  return res
}
function assert_isViteServerBuild(res1: boolean, configGlobal: ResolvedConfig | UserConfig, viteEnv: ViteEnv | undefined) {
  const isVite5 = viteEnv === undefined
  if (isVite5) {
    const res2: boolean = !!configGlobal.build?.ssr
    assert(res1 === res2)
    /*
    // @ts-expect-error
    assert(configGlobal.consumer === undefined)
    //*/
  } else {
    const res2: boolean = !!viteEnv.config.build?.ssr
    assert(res2 === res1)
    const res3: boolean = viteEnv.config.consumer === 'server'
    assert(res3 === res1)
    const res4: boolean = viteEnv.name !== 'client'
    assert(res4 === res1)
  }
}


// Only `ssr` env: for example don't include `vercel_edge` nor `vercel_node`.
function isViteServerBuild_onlySsrEnv(configGlobal: ResolvedConfig, viteEnv: Environment | undefined) {
  return viteEnv ? viteEnv.name === 'ssr' : isViteServerBuild(configGlobal, undefined)
}

function isViteClientBuild(configGlobal: ResolvedConfig, viteEnv: Environment | undefined) {
  return !isViteServerBuild(configGlobal, viteEnv)
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
