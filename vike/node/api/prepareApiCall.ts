export { prepareApiCall }

import type { InlineConfig } from 'vite'
import { resolveConfig } from 'vite'
import { getConfigVike } from '../shared/getConfigVike.js'
import { pluginName } from '../plugin/plugins/commonConfig/pluginName.js'
import type { Operation } from './types.js'
import { setOperation } from './context.js'

async function prepareApiCall(viteConfig: InlineConfig = {}, operation: Operation) {
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

  const configVike = await getConfigVike(viteConfigResolved)

  // TODO: enable Vike extensions to add Vite plugins

  return {
    viteConfigEnhanced,
    configVike
  }
}

async function resolveViteConfig(viteConfig: InlineConfig, operation: 'build' | 'dev' | 'preview' | 'prerender') {
  return await resolveConfig(
    viteConfig,
    operation === 'build' || operation === 'prerender' ? 'build' : 'serve',
    'custom',
    operation === 'dev' ? 'development' : 'production',
    operation === 'preview'
  )
}
