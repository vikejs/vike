export { resolveViteConfigFromUser }
export { isOnlyResolvingUserConfig }
export { getVikeConfigInternalEarly }
export { getViteApiArgsWithOperation }
export { getViteRoot }
export { assertViteRoot }
export { normalizeViteRoot }

import { loadConfigFromFile, mergeConfig, resolveConfig } from 'vite'
import type { InlineConfig, ResolvedConfig, UserConfig } from 'vite'
import type { ApiOperation } from './types.js'
import {
  getVikeConfigInternal,
  getVikeConfigFromCliOrEnv,
  setVikeConfigContext,
  isVikeConfigContextSet,
} from '../vite/shared/resolveVikeConfigInternal.js'
import path from 'node:path'
import { assert, assertUsage, getGlobalObject, pick, toPosixPath } from './utils.js'
import pc from '@brillout/picocolors'
import { getEnvVarObject } from '../vite/shared/getEnvVarObject.js'
import { getVikeApiOperation, isVikeCliOrApi } from './context.js'
import { getViteCommandFromCli } from '../vite/shared/isViteCli.js'

const globalObject = getGlobalObject<{ root?: string; isOnlyResolvingUserConfig?: boolean }>(
  'api/prepareViteApiCall.ts',
  {},
)

async function resolveViteConfigFromUser(
  viteConfigFromUserVikeApiOptions: InlineConfig | undefined,
  viteApiArgs: ViteApiArgs,
) {
  const viteInfo = await getViteInfo(viteConfigFromUserVikeApiOptions, viteApiArgs)
  setVikeConfigContext_(viteInfo, viteApiArgs)
  const { viteConfigFromUserResolved } = viteInfo
  const { viteConfigResolved } = await assertViteRoot2(viteInfo.root, viteConfigFromUserResolved, viteApiArgs)
  return {
    viteConfigResolved, // ONLY USE if strictly necessary. (We plan to remove assertViteRoot2() as explained in the comments of that function.)
    viteConfigFromUserResolved,
  }
}

async function getVikeConfigInternalEarly() {
  assert(!globalObject.isOnlyResolvingUserConfig) // ensure no infinite loop
  if (!isVikeConfigContextSet()) {
    const viteApiArgs = getViteApiArgs()
    const viteInfo = await getViteInfo(undefined, viteApiArgs)
    setVikeConfigContext_(viteInfo, viteApiArgs)
  }
  return await getVikeConfigInternal()
}

function setVikeConfigContext_(viteInfo: ViteInfo, viteApiArgs: ViteApiArgs) {
  setVikeConfigContext({
    userRootDir: viteInfo.root,
    isDev: viteApiArgs.isDev,
    vikeVitePluginOptions: viteInfo.vikeVitePluginOptions,
  })
}

function isOnlyResolvingUserConfig() {
  return globalObject.isOnlyResolvingUserConfig
}

async function getViteRoot(viteApiArgs: ViteApiArgs) {
  if (!globalObject.root) await getViteInfo(undefined, viteApiArgs)
  assert(globalObject.root)
  return globalObject.root
}

type ViteInfo = Awaited<ReturnType<typeof getViteInfo>>
async function getViteInfo(viteConfigFromUserVikeApiOptions: InlineConfig | undefined, viteApiArgs: ViteApiArgs) {
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
  globalObject.isOnlyResolvingUserConfig = true
  const viteConfigFromUserViteFile = await loadViteConfigFile(viteConfigFromUserResolved, viteApiArgs)
  globalObject.isOnlyResolvingUserConfig = false
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
    // TODO/now deprecate this
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

// TODO/now refactor & rename
type ViteApiArgs = {
  isBuild: boolean
  isPreview: boolean
  isDev: boolean
}
function getViteApiArgs(): ViteApiArgs {
  const vikeApiOperation = getVikeApiOperation()
  const viteCommand = getViteCommandFromCli()
  assert(!(viteCommand && vikeApiOperation))

  if (vikeApiOperation) return getViteApiArgsWithOperation(vikeApiOperation.operation)
  assert(!isVikeCliOrApi())

  if (viteCommand === 'dev' || viteCommand === 'optimize') {
    const viteApiArgs = {
      isDev: true,
      isBuild: false,
      isPreview: false,
    }
    return viteApiArgs
  }
  if (viteCommand === 'build') {
    const viteApiArgs = {
      isDev: false,
      isBuild: true,
      isPreview: false,
    }
    return viteApiArgs
  }
  if (viteCommand === 'preview') {
    const viteApiArgs = {
      isDev: false,
      isBuild: false,
      isPreview: true,
    }
    return viteApiArgs
  }

  // Third-party CLIs.
  // - Component development (e.g. Storybook) => let's consider it development
  // - Testing (e.g. Vitest) => let's consider it development
  const viteApiArgs = {
    isDev: true,
    isBuild: false,
    isPreview: false,
  }
  return viteApiArgs
}
function getViteApiArgsWithOperation(operation: ApiOperation): ViteApiArgs {
  const isBuild = operation === 'build' || operation === 'prerender'
  const isPreview = operation === 'preview'
  const isDev = operation === 'dev'
  const viteApiArgs = { isBuild, isPreview, isDev }
  return viteApiArgs
}
function resolveViteApiArgs(inlineConfig: InlineConfig = {}, viteApiArgs: ViteApiArgs) {
  const { isBuild, isPreview, isDev } = viteApiArgs
  const command = isBuild ? 'build' : 'serve'
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
