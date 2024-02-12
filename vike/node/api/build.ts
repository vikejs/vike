export { build }

import { resolveConfig } from './resolveConfig.js'
import { isVikeCli } from './isVikeCli.js'
import { build as buildVite } from 'vite'
import pc from '@brillout/picocolors'

async function build() {
  const { viteConfig, vikeConfigResolved, viteConfigResolved: resolvedConfig } = await resolveConfig({}, 'build')

  const clientOutput = await buildVite(viteConfig).catch((error) => {
    if (!isVikeCli) {
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
    if (!isVikeCli) {
      throw error
    }
    resolvedConfig.logger.error(pc.red(`error during build:\n${error.stack}`), { error })
    process.exit(1)
  })

  if (vikeConfigResolved.prerender) {
    const { runPrerenderFromAutoRun } = await import('../prerender/runPrerender.js')
    await runPrerenderFromAutoRun(viteConfig)
  }

  return { clientOutput, serverOutput }
}
