export { build }

import { resolveConfig } from './resolveConfig.js'
import { build as buildVite } from 'vite'

async function build() {
  const { viteConfig, vikeConfigResolved } = await resolveConfig({}, 'build')

  const clientOutput = await buildVite(viteConfig)

  const serverOutput = await buildVite({
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

  return { clientOutput, serverOutput }
}
