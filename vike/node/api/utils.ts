export type { Options }
export { resolveConfig }
export { isVikeCliCall }

import type { InlineConfig } from 'vite'
import type { ConfigVikeResolved, ConfigVikeUserProvided } from '../../shared/ConfigVike.js'
import { assert } from '../../utils/assert.js'
import { toPosixPath } from '../plugin/utils.js'

type Options = ConfigVikeUserProvided & { vite?: InlineConfig }

async function resolveConfig(options: Options, command: 'build' | 'serve' | 'preview') {
  const { default: pc } = await import('@brillout/picocolors')
  const { resolveConfig: resolveViteConfig, mergeConfig } = await import('vite')
  const { vite: viteConfig = {}, ...vikeConfig } = options

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
    console.error(pc.red(`error resolving config:\n${error.stack}`), {
      error
    })
    process.exit(1)
  })

  // Add vike to plugins if not present
  if (!viteConfigResolved.plugins.some((p) => p.name === 'vike:resolveVikeConfig')) {
    const { plugin } = await import('../plugin/index.js')

    options.vite ??= {}
    options.vite.plugins ??= []
    options.vite.plugins.push(plugin(vikeConfig))

    return resolveConfig(options, command)
  }

  const { getConfigVike } = await import('../shared/getConfigVike.js')
  const vikeConfigResolved = await getConfigVike(viteConfigResolved)
  // merge the inline config from the cli/api with the config resolved by vike
  // for example:
  // vike.config.js -> prerender:false
  // --config={prerender:true}
  // merged - {prerender:true}
  const mergedConfig = mergeConfig(vikeConfigResolved, options) as ConfigVikeResolved & {
    vite?: InlineConfig
  }
  const { vite: viteConfigMerged, ...mergedVikeConfigResolved } = mergedConfig

  return {
    viteConfig,
    vikeConfigResolved: mergedVikeConfigResolved,
    viteConfigResolved
  }
}

function isVikeCliCall() {
  let execPath = process.argv[1]
  assert(execPath)
  execPath = toPosixPath(execPath)
  return (
    // pnpm
    execPath.endsWith('/bin/vike.js') ||
    // npm & yarn
    execPath.endsWith('/.bin/vike') ||
    // Global install
    execPath.endsWith('/bin/vike')
  )
}
