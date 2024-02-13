export { resolveConfig }

import pc from '@brillout/picocolors'
import type { InlineConfig } from 'vite'
import { resolveConfig as resolveViteConfig } from 'vite'
import { getConfigVike } from '../shared/getConfigVike.js'
import { isVikeCli } from './isVikeCli.js'

async function resolveConfig(viteConfig: InlineConfig, command: 'build' | 'serve' | 'preview') {
  //TODO: do we need this?
  let nodeEnv = 'development'
  if (['build', 'preview'].includes(command)) {
    nodeEnv = 'production'
  }

  const viteConfigResolved = await resolveViteConfig(
    viteConfig,
    command === 'preview' ? 'serve' : command,
    'custom',
    nodeEnv,
    command === 'preview'
  ).catch((error) => {
    if (isVikeCli) {
      throw error
    }
    console.error(pc.red(`error resolving config:\n${error.stack}`), {
      error
    })
    process.exit(1)
  })

  // Add vike to plugins if not present
  if (!viteConfigResolved.plugins.some((p) => p.name.startsWith('vike:'))) {
    // We using a dynamic import because the script calling the VIke API may not live in the same place as vite.config.js, thus have vike/plugin may resolved to two different node_modules/vike directories
    const { plugin } = await import('../plugin/index.js')

    viteConfig ??= {}
    viteConfig.plugins ??= []
    viteConfig.plugins.push(plugin())

    return resolveConfig(viteConfig, command)
  }

  const vikeConfigResolved = await getConfigVike(viteConfigResolved)

  //TODO: add vite plugins from extension to viteConfig.plugins

  return {
    viteConfig,
    vikeConfigResolved,
    viteConfigResolved
  }
}
