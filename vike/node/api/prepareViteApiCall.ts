export { prepareViteApiCall }
export { getViteRoot }

// TODO: enable Vike extensions to add Vite plugins

import { loadConfigFromFile, resolveConfig } from 'vite'
import type { InlineConfig, PluginOption } from 'vite'
import type { Operation } from './types.js'
import { setOperation } from './context.js'
import { getVikeConfig2 } from '../plugin/plugins/importUserCode/v1-design/getVikeConfig.js'
import path from 'path'
import { assert, assertUsage, getGlobalObject, toPosixPath } from './utils.js'
import pc from '@brillout/picocolors'

const globalObject = getGlobalObject<{ root?: string }>('prepareViteApiCall.ts', {})

async function prepareViteApiCall(viteConfig: InlineConfig | undefined, operation: Operation) {
  setOperation(operation)
  return enhanceViteConfig(viteConfig, operation)
}

async function enhanceViteConfig(viteConfig: InlineConfig | undefined, operation: Operation) {
  const { root, vikeVitePluginOptions, viteConfigEnhanced } = await getInfoFromVite(viteConfig, operation)
  await assertRoot(root, viteConfigEnhanced, operation)
  const { vikeConfigGlobal } = await getVikeConfig2(root, operation === 'dev', vikeVitePluginOptions)
  return {
    viteConfigEnhanced,
    vikeConfigGlobal
  }
}

async function getViteRoot(operation: 'build' | 'dev' | 'preview' | 'prerender') {
  if (!globalObject.root) await getInfoFromVite(undefined, operation)
  assert(globalObject.root)
  return globalObject.root
}

async function getInfoFromVite(
  viteConfig: InlineConfig | undefined,
  operation: 'build' | 'dev' | 'preview' | 'prerender'
) {
  const viteConfigFromFile = await loadViteConfigFile(viteConfig, operation)

  const root = normalizeRoot(viteConfigFromFile?.root ?? viteConfig?.root ?? process.cwd())
  globalObject.root = root

  let vikeVitePluginOptions: Record<string, unknown> | undefined
  let viteConfigEnhanced = viteConfig
  const found = findVikeVitePlugin([...(viteConfig?.plugins ?? []), ...(viteConfigFromFile?.plugins ?? [])])
  if (found) {
    vikeVitePluginOptions = found.vikeVitePluginOptions
  } else {
    // Add Vike to plugins if not present.
    // Using a dynamic import because the script calling the Vike API may not live in the same place as vite.config.js, thus vike/plugin may resolved to two different node_modules/vike directories.
    const { plugin: vikePlugin } = await import('../plugin/index.js')
    viteConfigEnhanced = {
      ...viteConfig,
      plugins: [...(viteConfig?.plugins ?? []), vikePlugin()]
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
async function loadViteConfigFile(
  viteConfig: InlineConfig | undefined,
  operation: 'build' | 'dev' | 'preview' | 'prerender'
) {
  const [inlineConfig, command, defaultMode, _defaultNodeEnv, isPreview] = getResolveConfigArgs(viteConfig, operation)

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

function getResolveConfigArgs(viteConfig: InlineConfig = {}, operation: 'build' | 'dev' | 'preview' | 'prerender') {
  const inlineConfig = viteConfig
  const command = operation === 'build' || operation === 'prerender' ? 'build' : 'serve'
  const defaultMode = operation === 'dev' ? 'development' : 'production'
  const defaultNodeEnv = defaultMode
  const isPreview = operation === 'preview'
  return [inlineConfig, command, defaultMode, defaultNodeEnv, isPreview] as const
}

function normalizeRoot(root: string) {
  return toPosixPath(path.resolve(root))
}

async function assertRoot(root: string, viteConfigEnhanced: InlineConfig | undefined, operation: Operation) {
  const args = getResolveConfigArgs(viteConfigEnhanced, operation)
  const viteConfigResolved = await resolveConfig(...args)
  assertUsage(
    normalizeRoot(viteConfigResolved.root) === normalizeRoot(root),
    `A Vite plugin is modifying Vite's setting ${pc.cyan('root')} which is forbidden`
  )
}
