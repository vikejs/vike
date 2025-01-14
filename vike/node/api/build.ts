export { build }

import { prepareApiCall } from './prepareApiCall.js'
import { build as buildVite, type Rollup, type InlineConfig } from 'vite'
import type { APIOptions } from './types.js'

type RollupOutput = Rollup.RollupOutput | Rollup.RollupOutput[] | Rollup.RollupWatcher

async function build(options: APIOptions = {}): Promise<{
  rollupOutputClient: RollupOutput
  rollupOutputServer: RollupOutput
}> {
  const { viteConfigEnhanced, configVike } = await prepareApiCall(options.viteConfig, 'build')

  // Build client-side
  const outputClient = await buildVite(viteConfigEnhanced)

  // Build server-side
  const outputServer = await buildVite(setSSR(viteConfigEnhanced))

  // Pre-render
  if (configVike.prerender && !configVike.prerender.disableAutoRun && configVike.disableAutoFullBuild !== 'prerender') {
    const { runPrerenderFromAutoRun } = await import('../prerender/runPrerender.js')
    await runPrerenderFromAutoRun(viteConfigEnhanced, true)
  }

  return {
    /* We don't return `viteConfig` because `viteConfigEnhanced` is `InlineConfig` not `ResolvedConfig`
    viteConfig: viteConfigEnhanced,
    */
    rollupOutputClient: outputClient,
    rollupOutputServer: outputServer
  }
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
