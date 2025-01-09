export { enhanceViteConfig }

import type { InlineConfig } from 'vite'
import { resolveConfig } from 'vite'
import { getConfigVike } from '../shared/getConfigVike.js'
import { pluginName } from '../plugin/plugins/commonConfig/pluginName.js'

async function enhanceViteConfig(viteConfig: InlineConfig = {}, command: 'build' | 'dev' | 'preview' | 'prerender') {
  let viteConfigResolved = await resolveViteConfig(viteConfig, command)
  let viteConfigEnhanced = viteConfig

  // Add vike to plugins if not present
  if (!viteConfigResolved.plugins.some((p) => p.name === pluginName)) {
    // Using a dynamic import because the script calling the Vike API may not live in the same place as vite.config.js, thus have vike/plugin may resolved to two different node_modules/vike directories
    const { plugin: vikePlugin } = await import('../plugin/index.js')
    viteConfigEnhanced = {
      ...viteConfig,
      plugins: [...(viteConfig.plugins ?? []), vikePlugin()]
    }
    viteConfigResolved = await resolveViteConfig(viteConfigEnhanced, command)
  }

  const configVike = await getConfigVike(viteConfigResolved)

  //TODO: add vite plugins from extension to viteConfig.plugins

  return {
    viteConfigEnhanced,
    configVike
  }
}

async function resolveViteConfig(viteConfig: InlineConfig, command: 'build' | 'dev' | 'preview' | 'prerender') {
  return await resolveConfig(
    viteConfig,
    command === 'build' || command === 'prerender' ? 'build' : 'serve',
    'custom',
    command === 'dev' ? 'development' : 'production',
    command === 'preview'
  )
}
