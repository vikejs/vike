export { isViteServerSide }
export { isViteClientSide }
export { isViteServerSide_withoutEnv }
export { isViteServerSide_onlySsrEnv }
export { isViteServerSide_extraSafe }
export type { ViteEnv }

import type { Environment, EnvironmentOptions, ResolvedConfig, UserConfig } from 'vite'
import { assert } from '../../../utils/assert.js'

type ViteEnv = { name?: string; config: EnvironmentOptions | Environment['config'] }

function isViteServerSide_impl(configGlobal: ResolvedConfig | UserConfig, viteEnv: ViteEnv | undefined): boolean {
  assert(!('consumer' in configGlobal)) // make sure configGlobal isn't viteEnv.config
  const debug = {
    viteEnvIsUndefined: !viteEnv,
    viteEnvName: viteEnv?.name ?? null,
    viteEnvConsumer: viteEnv?.config.consumer ?? null,
    configEnvBuildSsr: viteEnv?.config.build?.ssr ?? null,
    configGlobalBuildSsr: configGlobal.build?.ssr ?? null,
  }
  if (!viteEnv) {
    const isServerSide = getBuildSsrValue(configGlobal.build?.ssr)
    assert(typeof isServerSide === 'boolean', debug)
    return isServerSide
  } else {
    const isServerSide1: boolean | null = !viteEnv.config.consumer ? null : viteEnv.config.consumer !== 'client'
    const isServerSide2: boolean | null = getBuildSsrValue(viteEnv.config.build?.ssr)
    const isServerSide3: boolean | null = viteEnv.name === 'ssr' ? true : viteEnv.name === 'client' ? false : null
    const isServerSide = isServerSide1 ?? isServerSide2
    assert(isServerSide === isServerSide1 || isServerSide1 === null, debug)
    assert(isServerSide === isServerSide2 || isServerSide2 === null, debug)
    assert(isServerSide === isServerSide3 || isServerSide3 === null, debug)
    assert(isServerSide !== null)
    return isServerSide
  }
}
function getBuildSsrValue(buildSsr: string | boolean | undefined): boolean | null {
  if (buildSsr === undefined) return null
  assert(typeof buildSsr === 'boolean' || typeof buildSsr === 'string')
  return !!buildSsr
}

function isViteServerSide(configGlobal: ResolvedConfig | UserConfig, viteEnv: ViteEnv) {
  return isViteServerSide_impl(configGlobal, viteEnv)
}
// TODO/now: rename
function isViteServerSide_withoutEnv(
  configGlobal: ResolvedConfig | UserConfig,
  viteEnv?: ViteEnv | undefined,
): boolean {
  return isViteServerSide_impl(configGlobal, viteEnv)
}

function isViteClientSide(configGlobal: ResolvedConfig, viteEnv: ViteEnv) {
  return !isViteServerSide(configGlobal, viteEnv)
}

// Only `ssr` env: for example don't include `vercel_edge` nor `vercel_node`.
function isViteServerSide_onlySsrEnv(configGlobal: ResolvedConfig, viteEnv: ViteEnv) {
  return viteEnv.name ? viteEnv.name === 'ssr' : isViteServerSide(configGlobal, viteEnv)
}

// TODO/now: improve args order
// Vite is quite messy about setting config.build.ssr — for security purposes, we use an extra safe implementation with lots of assertions, which is needed for the .client.js and .server.js guarantee.
function isViteServerSide_extraSafe(
  config: ResolvedConfig,
  options: { ssr?: boolean } | undefined,
  viteEnv: ViteEnv,
): boolean {
  const isServerSide = isViteServerSide(config, viteEnv)
  const debug = {
    isServerSide,
    configCommand: config.command,
    configBuildSsr: getBuildSsrValue(config.build.ssr),
    optionsIsUndefined: options === undefined,
    optionsSsr: options?.ssr,
  }
  assert(options, debug)
  assert(typeof options.ssr === 'boolean', debug)
  assert(options.ssr === isServerSide, debug)
  return isServerSide
}
