export { prepareViteApiCall }
export { getViteRoot }
export { assertViteRoot }
export { normalizeViteRoot }

import { loadConfigFromFile, mergeConfig, resolveConfig } from 'vite'
import type { InlineConfig, ResolvedConfig, UserConfig } from 'vite'
import type { ApiOptions, ApiOperation } from './types.js'
import { clearContextVikeApiOperation, setContextVikeApiOperation } from './context.js'
import {
  getVikeConfigInternal,
  getVikeConfigFromCliOrEnv,
  setVikeConfigContext,
  type VikeConfigInternal,
} from '../vite/shared/resolveVikeConfigInternal.js'
import path from 'node:path'
import { assert, assertUsage, getGlobalObject, isObject, pick, toPosixPath } from './utils.js'
import pc from '@brillout/picocolors'
import { clearGlobalContext } from '../runtime/globalContext.js'
import { getEnvVarObject } from '../vite/shared/getEnvVarObject.js'

const globalObject = getGlobalObject<{ root?: string }>('api/prepareViteApiCall.ts', {})

async function prepareViteApiCall(options: ApiOptions, operation: ApiOperation) {
  clear()
  setContextVikeApiOperation(operation, options)
  const viteConfigFromUserVikeApiOptions = options.viteConfig
  return resolveViteConfigEarly(viteConfigFromUserVikeApiOptions, operation)
}

// For subsequent API calls, e.g. calling prerender() after build()
function clear() {
  clearContextVikeApiOperation()
  clearGlobalContext()
}

async function resolveViteConfigEarly(
  viteConfigFromUserVikeApiOptions: InlineConfig | undefined,
  operation: ApiOperation,
) {
  const viteInfo = await getViteInfo(viteConfigFromUserVikeApiOptions, operation)
  setVikeConfigContext({
    userRootDir: viteInfo.root,
    isDev: operation === 'dev',
    vikeVitePluginOptions: viteInfo.vikeVitePluginOptions,
  })
  const vikeConfig = await getVikeConfigInternal()
  const viteConfigFromUserResolved = applyVikeViteConfig(viteInfo.viteConfigFromUserResolved, vikeConfig)
  const viteApiArgs = getViteApiArgsWithOperation(operation)
  const { viteConfigResolved } = await assertViteRoot2(viteInfo.root, viteConfigFromUserResolved, viteApiArgs)
  return {
    viteConfigResolved, // ONLY USE if strictly necessary. (We plan to remove assertViteRoot2() as explained in the comments of that function.)
    viteConfigFromUserResolved,
  }
}

// Apply +vite
// - For example, Vike extensions adding Vite plugins
function applyVikeViteConfig(viteConfigFromUserResolved: InlineConfig | undefined, vikeConfig: VikeConfigInternal) {
  const viteConfigs = vikeConfig._from.configsCumulative.vite
  if (!viteConfigs) return viteConfigFromUserResolved
  viteConfigs.values.forEach((v) => {
    assertUsage(isObject(v.value), `${v.definedAt} should be an object`)
    viteConfigFromUserResolved = mergeConfig(viteConfigFromUserResolved ?? {}, v.value)
    assertUsage(
      !findVikeVitePlugin(v.value as InlineConfig),
      "Using the +vite setting to add Vike's Vite plugin is forbidden",
    )
  })
  return viteConfigFromUserResolved
}

async function getViteRoot(operation: ApiOperation) {
  if (!globalObject.root) await getViteInfo(undefined, operation)
  assert(globalObject.root)
  return globalObject.root
}

async function getViteInfo(viteConfigFromUserVikeApiOptions: InlineConfig | undefined, operation: ApiOperation) {
  let viteConfigFromUserResolved = viteConfigFromUserVikeApiOptions

  // Precedence:
  //  1) viteConfigFromUserEnvVar (highest precedence)
  //  2) viteConfigFromUserVikeConfig
  //  2) viteConfigFromUserVikeApiOptions
  //  3) viteConfigFromUserViteFile (lowest precedence)

  // Resolve Vike's +mode setting
  {
    const viteConfigFromUserVikeConfig = pick(getVikeConfigFromCliOrEnv().vikeConfigFromCliOrEnv, ['mode'])
    if (Object.keys(viteConfigFromUserVikeConfig).length > 0) {
      viteConfigFromUserResolved = mergeConfig(viteConfigFromUserResolved ?? {}, viteConfigFromUserVikeConfig)
    }
  }

  // Resolve VITE_CONFIG
  const viteConfigFromUserEnvVar = getEnvVarObject('VITE_CONFIG')
  if (viteConfigFromUserEnvVar) {
    viteConfigFromUserResolved = mergeConfig(viteConfigFromUserResolved ?? {}, viteConfigFromUserEnvVar)
  }

  // Resolve vite.config.js
  const viteApiArgs = getViteApiArgsWithOperation(operation)
  const viteConfigFromUserViteFile = await loadViteConfigFile(viteConfigFromUserResolved, viteApiArgs)
  // Correct precedence, replicates Vite:
  // https://github.com/vitejs/vite/blob/4f5845a3182fc950eb9cd76d7161698383113b18/packages/vite/src/node/config.ts#L1001
  const viteConfigResolved = mergeConfig(viteConfigFromUserViteFile ?? {}, viteConfigFromUserResolved ?? {})

  const root = normalizeViteRoot(viteConfigResolved.root ?? process.cwd())
  globalObject.root = root

  // - Find options `vike(options)` set in vite.config.js
  //   - TO-DO/next-major-release: remove
  // - Add Vike's Vite plugin if missing
  let vikeVitePluginOptions: Record<string, unknown> | undefined
  const found = findVikeVitePlugin(viteConfigResolved)
  if (found) {
    vikeVitePluginOptions = found.vikeVitePluginOptions
  } else {
    // TODO deprecate this
    // Add Vike to plugins if not present.
    // Using a dynamic import because the script calling the Vike API may not live in the same place as vite.config.js, thus vike/plugin may resolved to two different node_modules/vike directories.
    const { plugin: vikePlugin } = await import('../vite/index.js')
    viteConfigFromUserResolved = {
      ...viteConfigFromUserResolved,
      plugins: [...(viteConfigFromUserResolved?.plugins ?? []), vikePlugin()],
    }
    const res = findVikeVitePlugin(viteConfigFromUserResolved)
    assert(res)
    vikeVitePluginOptions = res.vikeVitePluginOptions
  }
  assert(vikeVitePluginOptions)

  return { root, vikeVitePluginOptions, viteConfigFromUserResolved }
}

function findVikeVitePlugin(viteConfig: InlineConfig | UserConfig | undefined | null) {
  let vikeVitePluginOptions: Record<string, unknown> | undefined
  let vikeVitePuginFound = false
  viteConfig?.plugins?.forEach((p) => {
    if (p && '_vikeVitePluginOptions' in p) {
      vikeVitePuginFound = true
      const options = p._vikeVitePluginOptions
      vikeVitePluginOptions ??= {}
      Object.assign(vikeVitePluginOptions, options)
    }
  })
  if (!vikeVitePuginFound) return null
  return { vikeVitePluginOptions }
}

// Copied from https://github.com/vitejs/vite/blob/4f5845a3182fc950eb9cd76d7161698383113b18/packages/vite/src/node/config.ts#L961-L1005
async function loadViteConfigFile(viteConfigFromUserResolved: InlineConfig | undefined, viteApiArgs: ViteApiArgs) {
  const viteApiArgsResolved = resolveViteApiArgs(viteConfigFromUserResolved, viteApiArgs)
  const [inlineConfig, command, defaultMode, _defaultNodeEnv, isPreview] = viteApiArgsResolved

  let config = inlineConfig
  let mode = inlineConfig.mode || defaultMode

  const configEnv = {
    mode,
    command,
    isSsrBuild: command === 'build' && !!config.build?.ssr,
    isPreview,
  }

  let { configFile } = config
  if (configFile !== false) {
    const loadResult = await loadConfigFromFile(
      configEnv,
      configFile,
      config.root,
      config.logLevel,
      config.customLogger,
    )
    return loadResult?.config
  }
  return null
}

function getViteApiArgsWithOperation(operation: ApiOperation) {
  const isBuild = operation === 'build' || operation === 'prerender'
  const isPreview = operation === 'preview'
  const viteApiArgs = { isBuild, isPreview }
  return viteApiArgs
}
type ViteApiArgs = {
  isBuild: boolean
  isPreview: boolean
}
function resolveViteApiArgs(inlineConfig: InlineConfig = {}, viteApiArgs: ViteApiArgs) {
  const { isBuild, isPreview } = viteApiArgs
  const command = isBuild ? 'build' : 'serve'
  // Seems like a good choice:
  // - Component development (e.g. Storybook) => let's consider it development
  // - Testing (e.g. Vitest) => let's consider it development
  const isDev = !isBuild && !isPreview
  const defaultMode = isDev ? 'development' : 'production'
  const defaultNodeEnv = defaultMode
  const viteApiArgsResolved = [inlineConfig, command, defaultMode, defaultNodeEnv, isPreview] as const
  return viteApiArgsResolved
}

function normalizeViteRoot(root: string) {
  // `path.resolve(viteConfigFromUserViteFile.configFile, root)` could be more intuitive than `path.resolve(process.cwd(), root)` but we replicate Vite's behavior (`vite.config.js` should follow Vite's API), see:
  // https://github.com/vitejs/vite/blob/4f5845a3182fc950eb9cd76d7161698383113b18/packages/vite/src/node/config.ts#L1063
  return toPosixPath(
    // Equivalent to `path.resolve(process.cwd(), root)`
    path.resolve(root),
  )
}

const errMsg = `A Vite plugin is modifying Vite's setting ${pc.cyan('root')} which is forbidden`
async function assertViteRoot2(
  root: string,
  viteConfigFromUserResolved: InlineConfig | undefined,
  viteApiArgs: ViteApiArgs,
) {
  const viteApiArgsResolved = resolveViteApiArgs(viteConfigFromUserResolved, viteApiArgs)
  // We can eventually remove this resolveConfig() call (along with removing the whole assertViteRoot2() function which is redundant with the assertViteRoot() function) so that Vike doesn't make any resolveConfig() (except for pre-rendering and preview which is required). But let's keep it for now, just to see whether calling resolveConfig() can be problematic.
  const viteConfigResolved = await resolveConfig(...viteApiArgsResolved)
  assertUsage(normalizeViteRoot(viteConfigResolved.root) === normalizeViteRoot(root), errMsg)
  return { viteConfigResolved }
}
function assertViteRoot(root: string, config: ResolvedConfig) {
  if (globalObject.root) assert(normalizeViteRoot(globalObject.root) === normalizeViteRoot(root))
  assertUsage(normalizeViteRoot(root) === normalizeViteRoot(config.root), errMsg)
}
