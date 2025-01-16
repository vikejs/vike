export { prepareViteApiCall }

import { resolveConfig } from 'vite'
import type { InlineConfig } from 'vite'
import { pluginName } from '../plugin/plugins/commonConfig/pluginName.js'
import type { Operation } from './types.js'
import { setOperation } from './context.js'
import { getVikeConfig } from '../plugin/plugins/importUserCode/v1-design/getVikeConfig.js'

async function prepareViteApiCall(viteConfig: InlineConfig = {}, operation: Operation) {
  setOperation(operation)
  return enhanceViteConfig(viteConfig, operation)
}

async function enhanceViteConfig(viteConfig: InlineConfig = {}, operation: Operation) {
  let viteConfigResolved = await resolveViteConfig(viteConfig, operation)
  let viteConfigEnhanced = viteConfig

  // Add vike to plugins if not present
  if (!viteConfigResolved.plugins.some((p) => p.name === pluginName)) {
    // Using a dynamic import because the script calling the Vike API may not live in the same place as vite.config.js, thus have vike/plugin may resolved to two different node_modules/vike directories
    const { plugin: vikePlugin } = await import('../plugin/index.js')
    viteConfigEnhanced = {
      ...viteConfig,
      plugins: [...(viteConfig.plugins ?? []), vikePlugin()]
    }
    viteConfigResolved = await resolveViteConfig(viteConfigEnhanced, operation)
  }

  const { vikeConfigGlobal } = await getVikeConfig(viteConfigResolved, operation === 'dev')

  // TODO: enable Vike extensions to add Vite plugins

  return {
    viteConfigEnhanced,
    vikeConfigGlobal
  }
}

async function resolveViteConfig(viteConfig: InlineConfig, operation: 'build' | 'dev' | 'preview' | 'prerender') {
  const args = getResolveConfigArgs(viteConfig, operation)
  return await resolveConfig(...args)
}
function getResolveConfigArgs(viteConfig: InlineConfig, operation: 'build' | 'dev' | 'preview' | 'prerender') {
  const inlineConfig = viteConfig
  const command = operation === 'build' || operation === 'prerender' ? 'build' : 'serve'
  const defaultMode = operation === 'dev' ? 'development' : 'production'
  const defaultNodeEnv = defaultMode
  const isPreview = operation === 'preview'
  return [inlineConfig, command, defaultMode, defaultNodeEnv, isPreview] as const
}
