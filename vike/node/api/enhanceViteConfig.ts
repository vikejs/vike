export { enhanceViteConfig }

import type { InlineConfig } from 'vite'
import { resolveConfig } from 'vite'
import { getConfigVike } from '../shared/getConfigVike.js'
import { pluginName } from '../plugin/plugins/commonConfig/pluginName.js'

async function enhanceViteConfig(viteConfig: InlineConfig, command: 'build' | 'dev' | 'preview') {
  const viteConfigResolved = await resolveConfig(
    viteConfig,
    command === 'build' ? 'build' : 'serve',
    'custom',
    command === 'dev' ? 'development' : 'production',
    command === 'preview'
  )

  // Add vike to plugins if not present
  if (!viteConfigResolved.plugins.some((p) => p.name === pluginName)) {
    // We using a dynamic import because the script calling the VIke API may not live in the same place as vite.config.js, thus have vike/plugin may resolved to two different node_modules/vike directories
    const { plugin } = await import('../plugin/index.js')

    viteConfig ??= {}
    viteConfig.plugins ??= []
    viteConfig.plugins.push(plugin())

    return enhanceViteConfig(viteConfig, command)
  }

  const configVike = await getConfigVike(viteConfigResolved)

  //TODO: add vite plugins from extension to viteConfig.plugins

  return {
    viteConfig,
    configVike
  }
}
