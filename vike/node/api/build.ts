export { build }

import { enhanceViteConfig } from './enhanceViteConfig.js'
import { build as buildVite } from 'vite'

async function build() {
  const { viteConfigEnhanced, configVike } = await enhanceViteConfig({}, 'build')

  const outputClient = await buildVite(viteConfigEnhanced)

  const outputServer = await buildVite({
    ...viteConfigEnhanced,
    build: {
      ...viteConfigEnhanced.build,
      ssr: true
    }
  })

  if (configVike.prerender && !configVike.prerender.disableAutoRun && configVike.disableAutoFullBuild !== 'prerender') {
    const { runPrerenderFromAutoRun } = await import('../prerender/runPrerender.js')
    await runPrerenderFromAutoRun(viteConfigEnhanced)
  }

  return { outputClient, outputServer }
}
