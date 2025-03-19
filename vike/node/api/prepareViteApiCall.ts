export { prepareViteApiCall }
export { getViteRoot }
export { assertViteRoot }
export { normalizeViteRoot }

import { loadConfigFromFile, mergeConfig, resolveConfig } from 'vite'
import type { InlineConfig, ResolvedConfig, UserConfig } from 'vite'
import type { APIOptions, Operation } from './types.js'
import { clearContextApiOperation, setContextApiOperation } from './context.js'
import { getVikeConfig2, type VikeConfigObject } from '../plugin/plugins/importUserCode/v1-design/getVikeConfig.js'
import path from 'path'
import { assert, assertUsage, getGlobalObject, isObject, toPosixPath } from './utils.js'
import pc from '@brillout/picocolors'
import { clearGlobalContext } from '../runtime/globalContext.js'
import { getEnvVarObject } from '../plugin/shared/getEnvVarObject.js'

const globalObject = getGlobalObject<{ root?: string }>('api/prepareViteApiCall.ts', {})

async function prepareViteApiCall(options: APIOptions, operation: Operation) {
  clear()
  setContextApiOperation(operation, options)
  const viteConfigFromUserApiOptions = options.viteConfig
  return resolveConfigs(viteConfigFromUserApiOptions, operation)
}

// For subsequent API calls, e.g. calling prerender() after build()
function clear() {
  clearContextApiOperation()
  clearGlobalContext()
}

async function resolveConfigs(viteConfigFromUserApiOptions: InlineConfig | undefined, operation: Operation) {
  const viteInfo = await getViteInfo(viteConfigFromUserApiOptions, operation)
  await assertViteRoot2(viteInfo.root, viteInfo.viteConfigFromUserEnhanced, operation)
  const vikeConfig = await getVikeConfig2(viteInfo.root, operation === 'dev', viteInfo.vikeVitePluginOptions)
  const viteConfigFromUserEnhanced = applyVikeViteConfig(viteInfo.viteConfigFromUserEnhanced, vikeConfig)
  return {
    vikeConfig,
    viteConfigFromUserEnhanced
  }
}

// Apply +vite
// - For example, Vike extensions adding Vite plugins
function applyVikeViteConfig(
  viteConfigFromUserEnhanced: InlineConfig | undefined,
  vikeConfig: VikeConfigObject
) {
  const viteConfigs = vikeConfig.global._from.configsCumulative.vite
  if (!viteConfigs) return viteConfigFromUserEnhanced
  viteConfigs.values.forEach((v) => {
    assertUsage(isObject(v.value), `${v.definedAt} should be an object`)
    viteConfigFromUserEnhanced = mergeConfig(viteConfigFromUserEnhanced ?? {}, v.value)
    assertUsage(
      !findVikeVitePlugin(v.value as InlineConfig),
      "Using the +vite setting to add Vike's Vite plugin is forbidden"
    )
  })
  return viteConfigFromUserEnhanced
}

async function getViteRoot(operation: Operation) {
  if (!globalObject.root) await getViteInfo(undefined, operation)
  assert(globalObject.root)
  return globalObject.root
}

async function getViteInfo(viteConfigFromUserApiOptions: InlineConfig | undefined, operation: Operation) {
  let viteConfigFromUserEnhanced = viteConfigFromUserApiOptions

  // Precedence:
  //  - viteConfigFromUserEnvVar (highest precendence)
  //  - viteConfigFromUserApiOptions
  //  - viteConfigFromUserViteFile (lowest precendence)

  const viteConfigFromUserEnvVar = getEnvVarObject('VITE_CONFIG')
  if (viteConfigFromUserEnvVar)
    viteConfigFromUserEnhanced = mergeConfig(viteConfigFromUserEnhanced ?? {}, viteConfigFromUserEnvVar)

  const viteConfigFromUserViteFile = await loadViteConfigFile(viteConfigFromUserEnhanced, operation)
  // Correct precedence, replicates Vite:
  // https://github.com/vitejs/vite/blob/4f5845a3182fc950eb9cd76d7161698383113b18/packages/vite/src/node/config.ts#L1001
  const viteConfigResolved = mergeConfig(viteConfigFromUserViteFile ?? {}, viteConfigFromUserEnhanced ?? {})

  const root = normalizeViteRoot(viteConfigResolved.root ?? process.cwd())
  globalObject.root = root

  // - Find options `vike(options)` set in vite.config.js
  //   - TODO/next-major: remove
  // - Add Vike's Vite plugin if missing
  let vikeVitePluginOptions: Record<string, unknown> | undefined
  const found = findVikeVitePlugin(viteConfigResolved)
  if (found) {
    vikeVitePluginOptions = found.vikeVitePluginOptions
  } else {
    // Add Vike to plugins if not present.
    // Using a dynamic import because the script calling the Vike API may not live in the same place as vite.config.js, thus vike/plugin may resolved to two different node_modules/vike directories.
    const { plugin: vikePlugin } = await import('../plugin/index.js')
    viteConfigFromUserEnhanced = {
      ...viteConfigFromUserEnhanced,
      plugins: [...(viteConfigFromUserEnhanced?.plugins ?? []), vikePlugin()]
    }
    const res = findVikeVitePlugin(viteConfigFromUserEnhanced)
    assert(res)
    vikeVitePluginOptions = res.vikeVitePluginOptions
  }
  assert(vikeVitePluginOptions)

  return { root, vikeVitePluginOptions, viteConfigFromUserEnhanced }
}

function findVikeVitePlugin(viteConfig: InlineConfig | UserConfig | undefined | null) {
  let vikeVitePluginOptions: Record<string, unknown> | undefined
  let vikeVitePuginFound = false
  viteConfig?.plugins?.forEach((p) => {
    if (p && '__vikeVitePluginOptions' in p) {
      vikeVitePuginFound = true
      const options = p.__vikeVitePluginOptions
      vikeVitePluginOptions ??= {}
      Object.assign(vikeVitePluginOptions, options)
    }
  })
  if (!vikeVitePuginFound) return null
  return { vikeVitePluginOptions }
}

// Copied from https://github.com/vitejs/vite/blob/4f5845a3182fc950eb9cd76d7161698383113b18/packages/vite/src/node/config.ts#L961-L1005
async function loadViteConfigFile(viteConfigFromUserApiOptions: InlineConfig | undefined, operation: Operation) {
  const [inlineConfig, command, defaultMode, _defaultNodeEnv, isPreview] = getResolveConfigArgs(
    viteConfigFromUserApiOptions,
    operation
  )

  let config = inlineConfig
  let mode = inlineConfig.mode || defaultMode

  const configEnv = {
    mode,
    command,
    isSsrBuild: command === 'build' && !!config.build?.ssr,
    isPreview
  }

  let { configFile } = config
  if (configFile !== false) {
    const loadResult = await loadConfigFromFile(
      configEnv,
      configFile,
      config.root,
      config.logLevel,
      config.customLogger
    )
    return loadResult?.config
  }
  return null
}

function getResolveConfigArgs(viteConfig: InlineConfig = {}, operation: Operation) {
  const inlineConfig = viteConfig
  const command = operation === 'build' || operation === 'prerender' ? 'build' : 'serve'
  const defaultMode = operation === 'dev' ? 'development' : 'production'
  const defaultNodeEnv = defaultMode
  const isPreview = operation === 'preview'
  return [inlineConfig, command, defaultMode, defaultNodeEnv, isPreview] as const
}

function normalizeViteRoot(root: string) {
  // `path.resolve(viteConfigFromUserViteFile.configFile, root)` could be more intuitive than `path.resolve(process.cwd(), root)` but we replicate Vite's behavior (`vite.config.js` should follow Vite's API), see:
  // https://github.com/vitejs/vite/blob/4f5845a3182fc950eb9cd76d7161698383113b18/packages/vite/src/node/config.ts#L1063
  return toPosixPath(
    // Equivalent to `path.resolve(process.cwd(), root)`
    path.resolve(root)
  )
}

const errMsg = `A Vite plugin is modifying Vite's setting ${pc.cyan('root')} which is forbidden`
async function assertViteRoot2(
  root: string,
  viteConfigFromUserEnhanced: InlineConfig | undefined,
  operation: Operation
) {
  const args = getResolveConfigArgs(viteConfigFromUserEnhanced, operation)
  // We can eventually this resolveConfig() call (along with removing the whole assertViteRoot2() function which is redundant with the assertViteRoot() function) so that Vike doesn't make any resolveConfig() (except for pre-rendering which is required). But let's keep it for now, just to see whether calling resolveConfig() can be problematic.
  const viteConfigResolved = await resolveConfig(...args)
  assertUsage(normalizeViteRoot(viteConfigResolved.root) === normalizeViteRoot(root), errMsg)
}
function assertViteRoot(root: string, config: ResolvedConfig) {
  if (globalObject.root) assert(normalizeViteRoot(globalObject.root) === normalizeViteRoot(root))
  assertUsage(normalizeViteRoot(root) === normalizeViteRoot(config.root), errMsg)
}
