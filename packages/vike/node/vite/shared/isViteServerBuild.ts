// TODO/now: rename isViteServerSide
export { isViteServerBuild }
export { isViteClientBuild }
export { isViteServerBuild_withoutEnv }
export { isViteServerBuild_onlySsrEnv }
export { isViteServerBuild_extraSafe }
export type { ViteEnv }

import type { Environment, EnvironmentOptions, ResolvedConfig, UserConfig } from 'vite'
import { assert } from '../../../utils/assert.js'

type ViteEnv = { name?: string; config: EnvironmentOptions | Environment['config'] }

function isViteServerBuild_withoutEnv(configGlobal: ResolvedConfig | UserConfig, viteEnv?: ViteEnv): boolean {
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

function isViteServerBuild(configGlobal: ResolvedConfig | UserConfig, viteEnv: ViteEnv) {
  return isViteServerBuild_withoutEnv(configGlobal, viteEnv)
}

function isViteClientBuild(configGlobal: ResolvedConfig, viteEnv: ViteEnv) {
  return !isViteServerBuild(configGlobal, viteEnv)
}

// Only `ssr` env: for example don't include `vercel_edge` nor `vercel_node`.
function isViteServerBuild_onlySsrEnv(configGlobal: ResolvedConfig, viteEnv: ViteEnv) {
  return viteEnv ? viteEnv.name === 'ssr' : isViteServerBuild(configGlobal, viteEnv)
}

// Vite is quite messy about setting config.build.ssr — for security purposes, we use an extra safe implementation with lots of assertions, which is needed for the .client.js and .server.js guarantee.
function isViteServerBuild_extraSafe(
  config: ResolvedConfig,
  options: { ssr?: boolean } | undefined,
  viteEnv: ViteEnv,
): boolean {
  if (config.command === 'build') {
    const res = config.build.ssr
    assert(typeof res === 'boolean')
    assert(res === options?.ssr || options?.ssr === undefined)
    assert(res === isViteServerBuild(config, viteEnv))
    return res
  } else {
    const res = options?.ssr
    assert(typeof res === 'boolean')
    /* This assertion can fail, seems to be a Vite bug? It's very unexpected.
    if (typeof config.build.ssr === 'boolean') assert(res === config.build.ssr)
    */
    assert(res === isViteServerBuild(config, viteEnv))
    return res
  }
}
