export { resolveViteConfigFromUser }
export { isResolvingViteConfigUser }
export { getVikeConfigInternalEarly }
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
  EARLY_SETTINGS,
} from '../vite/shared/resolveVikeConfigInternal.js'
import path from 'node:path'
import { assert, assertUsage, assertWarning } from '../../utils/assert.js'
import { getGlobalObject } from '../../utils/getGlobalObject.js'
import { pick } from '../../utils/pick.js'
import { toPosixPath } from '../../utils/path.js'
import pc from '@brillout/picocolors'
import { getEnvVarObject } from '../vite/shared/getEnvVarObject.js'
import { getVikeApiOperation, isVikeCliOrApi } from '../../shared-server-node/api-context.js'
import { getViteCliCommand, getViteCliArgs } from '../vite/shared/isViteCli.js'
import type { Config } from '../../types/index.js'
import './assertEnvApiDevAndProd.js'

const globalObject = getGlobalObject<{ root?: string; isResolvingViteConfigUser?: boolean }>(
  'api/prepareViteApiCall.ts',
  {},
)

async function resolveViteConfigFromUser() {
  const { viteContext } = getVikeApiContext()
  assert(viteContext)
  const { viteConfigUser, root } = await resolve(viteContext)
  const { viteConfigResolved } = await assertViteRoot2(root, viteConfigUser, viteContext)
  return {
    viteConfigResolved, // ONLY USE if strictly necessary. (We plan to remove assertViteRoot2() as explained in the comments of that function.)
    viteConfigUser,
  }
}

async function getVikeConfigInternalEarly() {
  assert(!globalObject.isResolvingViteConfigUser) // ensure no infinite loop
  if (!isVikeConfigContextSet()) {
    const viteContext = getViteContext()
    const viteInfo = await resolve(viteContext)
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

function isResolvingViteConfigUser() {
  return globalObject.isResolvingViteConfigUser
}

async function getViteRoot(viteContext: ViteContext) {
  if (!globalObject.root) await resolve(viteContext)
  assert(globalObject.root)
  return globalObject.root
}

type ViteInfo = Awaited<ReturnType<typeof resolve>>
async function resolve(viteContext: ViteContext) {
  // Precedence:
  // 1. (highest precedence)  |  viteConfigFromViteEnv       |  VITE_CONFIG
  // 2.                       |  viteConfigFromVikeCliOrEnv  |  VIKE_CONFIG & Vike CLI options — `+mode` & `+root`
  // 3.                       |  viteConfigFromViteCli       |  Vite CLI args — `[root]` & `-c/--config`
  // 4.                       |  viteConfigFromVikeApi       |  Vike API options — `viteConfig`, and `+mode` & `+root` from `vikeConfig`
  // 5. (lowest precedence)   |  viteConfigFromViteFile      |  vite.config.js
  let viteConfigUser: UserConfig = {}
  // Merge `c` overriding viteConfigUser (`c` wins — higher precedence)
  const override = (c: UserConfig) => {
    viteConfigUser = mergeConfig(viteConfigUser, c)
  }
  // Merge `c` underiding viteConfigUser (`c` loses — lower precedence)
  const underide = (c: UserConfig) => {
    return mergeConfig(c, viteConfigUser)
  }

  // Vike API args
  const { viteConfigFromVikeApi, vikeConfigFromApi } = getVikeApiContext()
  override(viteConfigFromVikeApi ?? {}) // `viteConfig`
  override(pick(vikeConfigFromApi ?? {}, EARLY_SETTINGS)) // `+mode` & `+root`

  // Vite CLI args (when invoked via Vite's CLI rather than Vike's API).
  // - Without this, Vike loads vite.config.js blind to `vite [root]` / `-c <file>` and ends up with the wrong root when those Vite CLI args are used.
  const viteConfigFromViteCli = getViteCliArgs()
  if (viteConfigFromViteCli) override(viteConfigFromViteCli)

  // Vike's CLI and VIKE_CONFIG — `+mode` & `+root`
  {
    const viteConfigFromVikeCliOrEnv = pick(
      getVikeConfigFromCliOrEnv().vikeConfigFromCliOrEnv as Config,
      EARLY_SETTINGS,
    )
    if (Object.keys(viteConfigFromVikeCliOrEnv).length > 0) override(viteConfigFromVikeCliOrEnv)
  }

  // VITE_CONFIG
  const viteConfigFromViteEnv = getEnvVarObject('VITE_CONFIG')
  if (viteConfigFromViteEnv) override(viteConfigFromViteEnv)

  // vite.config.js — lowest precedence. Merged into a *separate* result (used only to compute `root` and to
  // find the Vike plugin): it must not flow back into `viteConfigUser`, which is handed to Vite —
  // Vite loads vite.config.js itself, so merging it here would add the Vike plugin twice.
  // Replicates Vite: https://github.com/vitejs/vite/blob/4f5845a3182fc950eb9cd76d7161698383113b18/packages/vite/src/node/config.ts#L1001
  globalObject.isResolvingViteConfigUser = true
  const viteConfigFromViteFile = await loadViteConfigFile(viteConfigUser, viteContext)
  globalObject.isResolvingViteConfigUser = false
  const viteConfigAll = underide(viteConfigFromViteFile ?? {})

  const root = normalizeViteRoot(viteConfigAll.root ?? process.cwd())
  globalObject.root = root

  // - Find options `vike(options)` set in vite.config.js
  //   - TO-DO/next-major-release: remove
  // - Add Vike's Vite plugin if missing
  let vikeVitePluginOptions: Record<string, unknown> | undefined
  const found = findVikeVitePlugin(viteConfigAll)
  if (found) {
    vikeVitePluginOptions = found.vikeVitePluginOptions
  } else {
    // Show a warning because Vike supports Vite's CLI (as well as third-party CLIs).
    // - Encourage users to define a vite.config.js file that also works with Vite's CLI (and potentially other third-party CLIs).
    // - Vike-based frameworks, such as DocPress, allow their users to omit defining a vite.config.js file.
    assertWarning(
      !viteConfigFromViteFile, // Only show the warning if the user defined a vite.config.js file
      "Omitting Vike's Vite plugin (inside your vite.config.js) is deprecated — make sure to always add Vike's Vite plugin https://vike.dev/vite-plugin",
      { onlyOnce: true },
    )
    // Add Vike to plugins if not present.
    // Using a dynamic import because the script calling the Vike API may not live in the same place as vite.config.js, thus vike/plugin may resolved to two different node_modules/vike directories.
    const { plugin: vikePlugin } = await import('../vite/index.js')
    viteConfigUser = {
      ...viteConfigUser,
      plugins: [...(viteConfigUser?.plugins ?? []), vikePlugin()],
    }
    const res = findVikeVitePlugin(viteConfigUser)
    assert(res)
    vikeVitePluginOptions = res.vikeVitePluginOptions
  }
  assert(vikeVitePluginOptions)

  return { viteConfigUser, root, vikeVitePluginOptions }
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
async function loadViteConfigFile(viteConfigUser: InlineConfig | undefined, viteContext: ViteContext) {
  const viteContextResolved = resolveViteContext(viteConfigUser, viteContext)
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
  const viteCommand = getViteCliCommand()
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
function getVikeApiContext() {
  const vikeApiOperation = getVikeApiOperation()
  if (!vikeApiOperation) return { viteConfigFromVikeApi: null, vikeConfigFromApi: null, viteContext: null }
  const { options, operation } = vikeApiOperation!
  const viteConfigFromVikeApi = options.viteConfig
  const vikeConfigFromApi = options.vikeConfig
  const viteContext = getViteContextWithOperation(operation)
  return { viteConfigFromVikeApi, vikeConfigFromApi, viteContext }
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
  // `path.resolve(viteConfigUserViteFile.configFile, root)` could be more intuitive than `path.resolve(process.cwd(), root)` but we replicate Vite's behavior (`vite.config.js` should follow Vite's API), see:
  // https://github.com/vitejs/vite/blob/4f5845a3182fc950eb9cd76d7161698383113b18/packages/vite/src/node/config.ts#L1063
  return toPosixPath(
    // Equivalent to `path.resolve(process.cwd(), root)`
    path.resolve(root),
  )
}

const errMsg = `A Vite plugin is modifying the Vite setting ${pc.cyan('root')} which is forbidden` as const
async function assertViteRoot2(root: string, viteConfigUser: InlineConfig | undefined, viteContext: ViteContext) {
  const viteContextResolved = resolveViteContext(viteConfigUser, viteContext)
  // We can eventually remove this resolveConfig() call (along with removing the whole assertViteRoot2() function which is redundant with the assertViteRoot() function) so that Vike doesn't make any resolveConfig() (except for pre-rendering and preview which is required). But let's keep it for now, just to see whether calling resolveConfig() can be problematic.
  const viteConfigResolved = await resolveConfig(...viteContextResolved)
  assertUsage(normalizeViteRoot(viteConfigResolved.root) === normalizeViteRoot(root), errMsg)
  return { viteConfigResolved }
}
function assertViteRoot(rootResolvedEarly: string, config: ResolvedConfig) {
  const rootResolved = config.root
  const rootGlobal = globalObject.root
  if (rootGlobal && normalizeViteRoot(rootGlobal) !== normalizeViteRoot(rootResolvedEarly)) {
    assert(false, {
      rootResolved,
      rootGlobal,
      rootResolvedEarly,
    })
  }
  assertUsage(normalizeViteRoot(rootResolvedEarly) === normalizeViteRoot(rootResolved), errMsg)
}
