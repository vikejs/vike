export { build }

import type { Options } from './utils.js'

async function build(options: Options = {}) {
  const { default: pc } = await import('@brillout/picocolors')
  const { build: buildVite } = await import('vite')
  const { resolveConfig, isVikeCliCall } = await import('./utils.js')
  const { viteConfig, vikeConfigResolved, viteConfigResolved: resolvedConfig } = await resolveConfig(options, 'build')
  const isCliCall = isVikeCliCall()

  const clientOutput = await buildVite(viteConfig).catch((error) => {
    if (!isCliCall) {
      throw error
    }
    resolvedConfig.logger.error(pc.red(`error during build:\n${error.stack}`), { error })
    process.exit(1)
  })

  const serverOutput = await buildVite({
    ...viteConfig,
    build: {
      ...viteConfig.build,
      ssr: true
    }
  }).catch((error) => {
    if (!isCliCall) {
      throw error
    }
    resolvedConfig.logger.error(pc.red(`error during build:\n${error.stack}`), { error })
    process.exit(1)
  })

  if (!vikeConfigResolved.prerender) {
    return { clientOutput, serverOutput }
  }

  const { prerender } = await import('./prerender.js')
  //@ts-ignore
  const prerenderConfig: Parameters<typeof prerender>[0] = {
    ...(typeof options.prerender === 'object' && options.prerender),
    viteConfig
  }
  await prerender(prerenderConfig)

  return { clientOutput, serverOutput }
}
