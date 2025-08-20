// TODO/now: rename isViteServerSide
export { isViteServerBuild }
export { isViteClientBuild }
export { isViteServerBuild_onlySsrEnv }
export { isViteServerBuild_options }
export { isViteServerBuild_transform }
export type { ViteEnv }

import type { Environment, EnvironmentOptions, ResolvedConfig, UserConfig } from 'vite'
import { assert } from '../../../utils/assert.js'

type ViteEnv = { name?: string; config: EnvironmentOptions | Environment['config'] }

function isViteServerBuild(configGlobal: ResolvedConfig | UserConfig, viteEnv: ViteEnv | undefined): boolean {
  assert(!('consumer' in configGlobal)) // make sure configGlobal isn't viteEnv.config
  const isServerSide1: boolean | null = !viteEnv?.config.consumer ? null : viteEnv.config.consumer !== 'client'
  const isServerSide2: boolean | null = !viteEnv?.name ? null : viteEnv.name !== 'client' // I can't think of a use case for creating another client-side environment
  const isServerSide3: boolean | null = !viteEnv ? null : !!viteEnv.config.build?.ssr
  const isServerSide4: boolean = !!configGlobal.build?.ssr
  const debug = {
    envIsUndefined: !viteEnv,
    envName: viteEnv?.name ?? null,
    envConsumer: viteEnv?.config.consumer ?? null,
    configEnvBuildSsr: viteEnv?.config.build?.ssr ?? null,
    configGlobalBuildSsr: configGlobal.build?.ssr ?? null,
    isServerSide1,
    isServerSide2,
    isServerSide3,
    isServerSide4,
  }
  if (isServerSide1 !== null) {
    assert(isServerSide1 === isServerSide2 || isServerSide2 === null, debug)
    assert(isServerSide1 === isServerSide3, debug)
    return isServerSide1
  }
  if (isServerSide2 !== null) {
    /* This assertion can fail, seems to be a Vite bug?
    assert(isServerSide2 === isServerSide3, debug)
    */
    return isServerSide2
  }
  if (isServerSide3 !== null) {
    return isServerSide3
  }
  return isServerSide4
}

function isViteClientBuild(configGlobal: ResolvedConfig, viteEnv: ViteEnv | undefined) {
  return !isViteServerBuild(configGlobal, viteEnv)
}

// Only `ssr` env: for example don't include `vercel_edge` nor `vercel_node`.
function isViteServerBuild_onlySsrEnv(configGlobal: ResolvedConfig, viteEnv: ViteEnv | undefined) {
  return viteEnv ? viteEnv.name === 'ssr' : isViteServerBuild(configGlobal, undefined)
}

function isViteServerBuild_options(options: { ssr?: boolean } | undefined): boolean {
  return !!options?.ssr
}

// Vite is quite messy about setting `ssr: boolean`, thus we use an extra safe implementation for security purposes.
// It's used for .client.js and .server.js guarantee thus we use aggressive assert() calls for added safety.
function isViteServerBuild_transform(
  config: ResolvedConfig,
  options: { ssr?: boolean } | undefined,
  viteEnv: ViteEnv,
): boolean {
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
