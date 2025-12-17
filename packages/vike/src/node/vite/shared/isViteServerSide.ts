export { isViteServerSide }
export { isViteServerSide_viteEnvOptional }
export { isViteServerSide_onlySsrEnv }
export { isViteServerSide_extraSafe }
export { isViteServerSide_applyToEnvironment }
export { isViteServerSide_configEnvironment }
export type { ViteEnv }

import type { Environment, EnvironmentOptions, ResolvedConfig, UserConfig, Plugin } from 'vite'
import { assert, assertUsage, viteVersionMin } from '../utils.js'

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
function isViteServerSide_viteEnvOptional(
  configGlobal: ResolvedConfig | UserConfig,
  viteEnv?: ViteEnv | undefined,
): boolean {
  return isViteServerSide_impl(configGlobal, viteEnv)
}

// Only `ssr` env: for example don't include `vercel_edge` nor `vercel_node`.
function isViteServerSide_onlySsrEnv(configGlobal: ResolvedConfig, viteEnv: ViteEnv) {
  return viteEnv.name ? viteEnv.name === 'ssr' : isViteServerSide(configGlobal, viteEnv)
}

// Vite is quite messy about setting config.build.ssr — for security purposes, we use an extra safe implementation with lots of assertions, which is needed for the .client.js and .server.js guarantee.
function isViteServerSide_extraSafe(
  config: ResolvedConfig,
  viteEnv: ViteEnv,
  options: { ssr?: boolean } | undefined,
): boolean {
  const isServerSide = isViteServerSide(config, viteEnv)
  const debug = {
    isServerSide,
    configCommand: config.command,
    configBuildSsr: getBuildSsrValue(config.build.ssr),
    optionsIsUndefined: options === undefined,
    optionsSsr: options?.ssr ?? null,
  }
  assert(options, debug)
  /* TO-DO/eventually: use internal assert() instead of assertUsage() once we can use this.meta.viteVersion — see utils/assertViteVersion.ts
  assert(typeof options.ssr === 'boolean', debug)
  /*/
  assertUsage(
    typeof options.ssr === 'boolean',
    `You're using an old Vite version — update Vite to ${viteVersionMin} or above.`,
  )
  //*/
  assert(options.ssr === isServerSide, debug)
  return isServerSide
}

type PartialEnvironment = Parameters<NonNullable<Plugin['applyToEnvironment']>>[0]
function isViteServerSide_applyToEnvironment(env: PartialEnvironment) {
  const { consumer } = env.config
  return isViteServerSide_consumer(consumer)
}
function isViteServerSide_configEnvironment(name: string, config: EnvironmentOptions) {
  const consumer = config.consumer ?? (name === 'client' ? 'client' : 'server')
  return isViteServerSide_consumer(consumer)
}
function isViteServerSide_consumer(consumer: string) {
  return consumer !== 'client'
}
