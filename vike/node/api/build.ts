export { build }

import { resolveConfig } from './resolveConfig.js'
import { build as buildVite } from 'vite'

async function build() {
  const { viteConfig, vikeConfigResolved } = await resolveConfig({}, 'build')

  const outputClient = await buildVite(viteConfig)

  const outputServer = await buildVite({
    ...viteConfig,
    build: {
      ...viteConfig.build,
      ssr: true
    }
  })

  if (vikeConfigResolved.prerender) {
    const { runPrerenderFromAutoRun } = await import('../prerender/runPrerender.js')
    await runPrerenderFromAutoRun(viteConfig)
  }

  return { outputClient, outputServer }
}
