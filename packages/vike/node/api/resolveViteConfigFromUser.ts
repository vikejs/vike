export { resolveViteConfigFromUser }
export { isOnlyResolvingUserConfig }
export { getVikeConfigInternalEarly }
export { getViteContextWithOperation }
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
import { assert, assertUsage, assertWarning, getGlobalObject, pick, toPosixPath } from './utils.js'
import pc from '@brillout/picocolors'
import { getEnvVarObject } from '../vite/shared/getEnvVarObject.js'
import { getVikeApiOperation, isVikeCliOrApi } from '../../shared-server-node/api-context.js'
import { getViteCommandFromCli } from '../vite/shared/isViteCli.js'
import type { Config } from '../../types/index.js'

const globalObject = getGlobalObject<{ root?: string; isOnlyResolvingUserConfig?: boolean }>(
  'api/prepareViteApiCall.ts',
  {},
)

async function resolveViteConfigFromUser(
  viteConfigFromUserVikeApiOptions: InlineConfig | undefined,
  viteContext: ViteContext,
) {
  const viteInfo = await getViteInfo(viteConfigFromUserVikeApiOptions, viteContext)
  setVikeConfigContext_(viteInfo, viteContext)
  const { viteConfigFromUserResolved } = viteInfo
  const { viteConfigResolved } = await assertViteRoot2(viteInfo.root, viteConfigFromUserResolved, viteContext)
  return {
    viteConfigResolved, // ONLY USE if strictly necessary. (We plan to remove assertViteRoot2() as explained in the comments of that function.)
    viteConfigFromUserResolved,
  }
}

async function getVikeConfigInternalEarly() {
  assert(!globalObject.isOnlyResolvingUserConfig) // ensure no infinite loop
  if (!isVikeConfigContextSet()) {
    const viteContext = getViteContext()
    const viteInfo = await getViteInfo(undefined, viteContext)
    setVikeConfigContext_(viteInfo, viteContext)
  }
  return await getVikeConfigInternal()
}

function setVikeConfigContext_(viteInfo: ViteInfo, viteContext: ViteContext) {
  setVikeConfigContext({
    userRootDir: viteInfo.root,
    isDev: viteContext === 'dev',
    vikeVitePluginOptions: viteInfo.vikeVitePluginOptions,
  })
}

function isOnlyResolvingUserConfig() {
  return globalObject.isOnlyResolvingUserConfig
}

async function getViteRoot(viteContext: ViteContext) {
  if (!globalObject.root) await getViteInfo(undefined, viteContext)
  assert(globalObject.root)
  return globalObject.root
}

type ViteInfo = Awaited<ReturnType<typeof getViteInfo>>
async function getViteInfo(viteConfigFromUserVikeApiOptions: InlineConfig | undefined, viteContext: ViteContext) {
  let viteConfigFromUserResolved = clone(viteConfigFromUserVikeApiOptions ?? {})

  // Precedence:
  // 1. (highest precedence)  |  viteConfigFromUserEnvVar          |  VITE_CONFIG
  // 2.                       |  viteConfigFromUserVikeMode        |  VIKE_CONFIG & Vike CLI options — only `+mode`
  // 2.                       |  viteConfigFromUserVikeApiOptions  |  Vike API options
  // 3. (lowest precedence)   |  viteConfigFromUserViteFile        |  vite.config.js

  // Resolve Vike's +mode setting
  {
    const viteConfigFromUserVikeMode = pick(getVikeConfigFromCliOrEnv().vikeConfigFromCliOrEnv as Config, ['mode'])
    if (Object.keys(viteConfigFromUserVikeMode).length > 0) {
      viteConfigFromUserResolved = merge(viteConfigFromUserResolved ?? {}, viteConfigFromUserVikeMode)
    }
  }

  // Resolve VITE_CONFIG
  const viteConfigFromUserEnvVar = getEnvVarObject('VITE_CONFIG')
  if (viteConfigFromUserEnvVar) {
    viteConfigFromUserResolved = merge(viteConfigFromUserResolved ?? {}, viteConfigFromUserEnvVar)
  }

  // Resolve vite.config.js
  globalObject.isOnlyResolvingUserConfig = true
  const viteConfigFromUserViteConfigFile = await loadViteConfigFile(viteConfigFromUserResolved, viteContext)
  globalObject.isOnlyResolvingUserConfig = false
  // Correct precedence, replicates Vite:
  // https://github.com/vitejs/vite/blob/4f5845a3182fc950eb9cd76d7161698383113b18/packages/vite/src/node/config.ts#L1001
  const viteConfigResolved = merge(viteConfigFromUserViteConfigFile ?? {}, viteConfigFromUserResolved ?? {})

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
    // Show a warning because Vike supports Vite's CLI (as well as third-party CLIs).
    // - Encourage users to define a vite.config.js file that also works with Vite's CLI (and potentially other third-party CLIs).
    // - Vike-based frameworks, such as DocPress, allow their users to omit defining a vite.config.js file.
    assertWarning(
      !viteConfigFromUserViteConfigFile, // Only show the warning if the user defined a vite.config.js file
      "Omitting Vike's Vite plugin (inside your vite.config.js) is deprecated — make sure to always add Vike's Vite plugin https://vike.dev/vite-plugin",
      { onlyOnce: true },
    )
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
/** `c2` overrides `c1` */
function merge(c1: UserConfig, c2: UserConfig): UserConfig {
  return mergeConfig(c1, c2)
}
function clone(c: UserConfig): UserConfig {
  return mergeConfig({}, c)
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
async function loadViteConfigFile(viteConfigFromUserResolved: InlineConfig | undefined, viteContext: ViteContext) {
  const viteContextResolved = resolveViteContext(viteConfigFromUserResolved, viteContext)
  const [inlineConfig, command, defaultMode, _defaultNodeEnv, isPreview] = viteContextResolved

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
    if (!loadResult) return null
    assert(loadResult.config)
    return loadResult.config
  }
  return null
}

type ViteContext = 'build' | 'preview' | 'dev'
function getViteContext(): ViteContext {
  const vikeApiOperation = getVikeApiOperation()
  const viteCommand = getViteCommandFromCli()
  assert(!(viteCommand && vikeApiOperation))

  if (vikeApiOperation) return getViteContextWithOperation(vikeApiOperation.operation)
  assert(!isVikeCliOrApi())

  if (viteCommand === 'dev' || viteCommand === 'optimize') {
    return 'dev'
  }
  if (viteCommand === 'build') {
    return 'build'
  }
  if (viteCommand === 'preview') {
    return 'preview'
  }

  // Third-party CLIs.
  // - Component development (e.g. Storybook) => let's consider it development
  // - Testing (e.g. Vitest) => let's consider it development
  return 'dev'
}
function getViteContextWithOperation(operation: ApiOperation): ViteContext {
  if (operation === 'build' || operation === 'prerender') {
    return 'build'
  }
  if (operation === 'preview') {
    return 'preview'
  }
  if (operation === 'dev') {
    return 'dev'
  }
  assert(false)
}
function resolveViteContext(inlineConfig: InlineConfig = {}, viteContext: ViteContext) {
  const isBuild = viteContext === 'build'
  const isPreview = viteContext === 'preview'
  const isDev = viteContext === 'dev'
  const command = isBuild ? 'build' : 'serve'
  const defaultMode = isDev ? 'development' : 'production'
  const defaultNodeEnv = defaultMode
  const viteContextResolved = [inlineConfig, command, defaultMode, defaultNodeEnv, isPreview] as const
  return viteContextResolved
}

function normalizeViteRoot(root: string) {
  // `path.resolve(viteConfigFromUserViteFile.configFile, root)` could be more intuitive than `path.resolve(process.cwd(), root)` but we replicate Vite's behavior (`vite.config.js` should follow Vite's API), see:
  // https://github.com/vitejs/vite/blob/4f5845a3182fc950eb9cd76d7161698383113b18/packages/vite/src/node/config.ts#L1063
  return toPosixPath(
    // Equivalent to `path.resolve(process.cwd(), root)`
    path.resolve(root),
  )
}

const errMsg = `A Vite plugin is modifying the Vite setting ${pc.cyan('root')} which is forbidden` as const
async function assertViteRoot2(
  root: string,
  viteConfigFromUserResolved: InlineConfig | undefined,
  viteContext: ViteContext,
) {
  const viteContextResolved = resolveViteContext(viteConfigFromUserResolved, viteContext)
  // We can eventually remove this resolveConfig() call (along with removing the whole assertViteRoot2() function which is redundant with the assertViteRoot() function) so that Vike doesn't make any resolveConfig() (except for pre-rendering and preview which is required). But let's keep it for now, just to see whether calling resolveConfig() can be problematic.
  const viteConfigResolved = await resolveConfig(...viteContextResolved)
  assertUsage(normalizeViteRoot(viteConfigResolved.root) === normalizeViteRoot(root), errMsg)
  return { viteConfigResolved }
}
function assertViteRoot(rootResolvedEarly: string, config: ResolvedConfig) {
  const rootResolved = config.root
  const rootGlobal = globalObject.root
  if (rootGlobal) assert(normalizeViteRoot(rootGlobal) === normalizeViteRoot(rootResolvedEarly))
  assertUsage(normalizeViteRoot(rootResolvedEarly) === normalizeViteRoot(rootResolved), errMsg)
}
