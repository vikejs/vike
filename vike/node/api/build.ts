export { build }

import { enhanceViteConfig } from './enhanceViteConfig.js'
import { build as buildVite, type InlineConfig } from 'vite'
import type { APIOptions } from './APIOptions.js'

async function build(options: APIOptions = {}) {
  const { viteConfigEnhanced, configVike } = await enhanceViteConfig(options.viteConfig, 'build')

  // Build client-side
  const outputClient = await buildVite(viteConfigEnhanced)

  // Build server-side
  const outputServer = await buildVite(setSSR(viteConfigEnhanced))

  // Pre-render
  if (configVike.prerender && !configVike.prerender.disableAutoRun && configVike.disableAutoFullBuild !== 'prerender') {
    const { runPrerenderFromAutoRun } = await import('../prerender/runPrerender.js')
    await runPrerenderFromAutoRun(viteConfigEnhanced, true)
  }

  return { outputClient, outputServer }
}

function setSSR(viteConfig: InlineConfig): InlineConfig {
  return {
    ...viteConfig,
    build: {
      ...viteConfig.build,
      ssr: true
    }
  }
}
