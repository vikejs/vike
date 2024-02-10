export { resolveConfig }
export { isCliCall, setCliCall }

import type { InlineConfig } from 'vite'

async function resolveConfig(viteConfig: InlineConfig, command: 'build' | 'serve' | 'preview') {
  const { default: pc } = await import('@brillout/picocolors')
  const { resolveConfig: resolveViteConfig, mergeConfig } = await import('vite')
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
  if (!viteConfigResolved.plugins.some((p) => p.name.startsWith('vike:'))) {
    const { plugin } = await import('../plugin/index.js')

    viteConfig ??= {}
    viteConfig.plugins ??= []
    viteConfig.plugins.push(plugin())

    return resolveConfig(viteConfig, command)
  }

  const { getConfigVike } = await import('../shared/getConfigVike.js')
  const vikeConfigResolved = await getConfigVike(viteConfigResolved)

  return {
    viteConfig,
    vikeConfigResolved,
    viteConfigResolved
  }
}

let isCliCall = false
function setCliCall() {
  isCliCall = true
}
