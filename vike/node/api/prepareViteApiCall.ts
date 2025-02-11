export { prepareViteApiCall }
export { getViteRoot }
export { assertViteRoot }
export { normalizeViteRoot }

// TODO: enable Vike extensions to add Vite plugins

import { loadConfigFromFile, mergeConfig, resolveConfig } from 'vite'
import type { InlineConfig, PluginOption, ResolvedConfig } from 'vite'
import type { Operation } from './types.js'
import { clearContextApiOperation, setContextApiOperation } from './context.js'
import { getVikeConfig2, type VikeConfigObject } from '../plugin/plugins/importUserCode/v1-design/getVikeConfig.js'
import path from 'path'
import { assert, assertUsage, getGlobalObject, isObject, toPosixPath } from './utils.js'
import pc from '@brillout/picocolors'
import { clearGlobalContext } from '../runtime/globalContext.js'

const globalObject = getGlobalObject<{ root?: string }>('prepareViteApiCall.ts', {})

async function prepareViteApiCall(viteConfigFromOptions: InlineConfig | undefined, operation: Operation) {
  clear()
  setContextApiOperation(operation)
  return enhanceViteConfig(viteConfigFromOptions, operation)
}

// For subsequent API calls, e.g. calling prerender() after build()
function clear() {
  clearContextApiOperation()
  clearGlobalContext()
}

async function enhanceViteConfig(viteConfigFromOptions: InlineConfig | undefined, operation: Operation) {
  const viteInfo = await getInfoFromVite(viteConfigFromOptions, operation)
  await assertViteRoot2(viteInfo.root, viteInfo.viteConfigEnhanced, operation)
  const vikeConfig = await getVikeConfig2(viteInfo.root, operation === 'dev', viteInfo.vikeVitePluginOptions)
  const viteConfigEnhanced = addViteSettingsSetByVikeConfig(viteInfo.viteConfigEnhanced, vikeConfig)
  return {
    vikeConfig,
    viteConfigEnhanced
  }
}

function addViteSettingsSetByVikeConfig(viteConfigEnhanced: InlineConfig | undefined, vikeConfig: VikeConfigObject) {
  const viteConfigs = vikeConfig.global._from.configsCumulative.vite
  if (!viteConfigs) return viteConfigEnhanced
  viteConfigs.values.forEach((v) => {
    assertUsage(isObject(v.value), `${v.definedAt} should be an object`)
    viteConfigEnhanced = mergeConfig(viteConfigEnhanced ?? {}, v.value)
  })
  return viteConfigEnhanced
}

async function getViteRoot(operation: Operation) {
  if (!globalObject.root) await getInfoFromVite(undefined, operation)
  assert(globalObject.root)
  return globalObject.root
}

async function getInfoFromVite(viteConfigFromOptions: InlineConfig | undefined, operation: Operation) {
  const viteConfigFromUserViteFile = await loadViteConfigFile(viteConfigFromOptions, operation)

  const root = normalizeViteRoot(viteConfigFromUserViteFile?.root ?? viteConfigFromOptions?.root ?? process.cwd())
  globalObject.root = root

  let vikeVitePluginOptions: Record<string, unknown> | undefined
  let viteConfigEnhanced = viteConfigFromOptions
  const found = findVikeVitePlugin([
    ...(viteConfigFromOptions?.plugins ?? []),
    ...(viteConfigFromUserViteFile?.plugins ?? [])
  ])
  if (found) {
    vikeVitePluginOptions = found.vikeVitePluginOptions
  } else {
    // Add Vike to plugins if not present.
    // Using a dynamic import because the script calling the Vike API may not live in the same place as vite.config.js, thus vike/plugin may resolved to two different node_modules/vike directories.
    const { plugin: vikePlugin } = await import('../plugin/index.js')
    viteConfigEnhanced = {
      ...viteConfigFromOptions,
      plugins: [...(viteConfigFromOptions?.plugins ?? []), vikePlugin()]
    }
    const res = findVikeVitePlugin(viteConfigEnhanced.plugins!)
    assert(res)
    vikeVitePluginOptions = res.vikeVitePluginOptions
  }
  assert(vikeVitePluginOptions)

  return { root, vikeVitePluginOptions, viteConfigEnhanced }
}

function findVikeVitePlugin(plugins: PluginOption[]) {
  let vikeVitePluginOptions: Record<string, unknown> | undefined
  let vikeVitePuginFound = false
  plugins.forEach((p) => {
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
async function loadViteConfigFile(viteConfigFromOptions: InlineConfig | undefined, operation: Operation) {
  const [inlineConfig, command, defaultMode, _defaultNodeEnv, isPreview] = getResolveConfigArgs(
    viteConfigFromOptions,
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
  return toPosixPath(path.resolve(root))
}

const errMsg = `A Vite plugin is modifying Vite's setting ${pc.cyan('root')} which is forbidden`
async function assertViteRoot2(root: string, viteConfigEnhanced: InlineConfig | undefined, operation: Operation) {
  const args = getResolveConfigArgs(viteConfigEnhanced, operation)
  // We can eventually this resolveConfig() call (along with removing the whole assertViteRoot2() function which is redundant with the assertViteRoot() function) so that Vike doesn't make any resolveConfig() (except for pre-rendering which is required). But let's keep it for now, just to see whether calling resolveConfig() can be problematic.
  const viteConfigResolved = await resolveConfig(...args)
  assertUsage(normalizeViteRoot(viteConfigResolved.root) === normalizeViteRoot(root), errMsg)
}
function assertViteRoot(root: string, config: ResolvedConfig) {
  if (globalObject.root) assert(normalizeViteRoot(globalObject.root) === normalizeViteRoot(root))
  assertUsage(normalizeViteRoot(root) === normalizeViteRoot(config.root), errMsg)
}
