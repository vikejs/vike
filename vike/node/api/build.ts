export { build }

import { enhanceViteConfig } from './enhanceViteConfig.js'
import { build as buildVite, type InlineConfig } from 'vite'

async function build() {
  const { viteConfigEnhanced, configVike } = await enhanceViteConfig({}, 'build')

  // Build client-side
  const outputClient = await buildVite(viteConfigEnhanced)

  // Build server-side
  const outputServer = await buildVite(addSSR(viteConfigEnhanced))

  // Pre-render
  if (configVike.prerender && !configVike.prerender.disableAutoRun && configVike.disableAutoFullBuild !== 'prerender') {
    const { runPrerenderFromAutoRun } = await import('../prerender/runPrerender.js')
    await runPrerenderFromAutoRun(viteConfigEnhanced)
  }

  return { outputClient, outputServer }
}

function addSSR(viteConfigEnhanced: InlineConfig): InlineConfig {
  return {
    ...viteConfigEnhanced,
    build: {
      ...viteConfigEnhanced.build,
      ssr: true
    }
  }
}
