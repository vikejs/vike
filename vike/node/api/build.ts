export { build }

import { prepareViteApiCall } from './prepareViteApiCall.js'
import { build as buildVite, type Rollup, type InlineConfig } from 'vite'
import { isPrerenderEnabled } from '../prerender/isPrerenderEnabled.js'
import type { APIOptions } from './types.js'

type RollupOutput = Rollup.RollupOutput | Rollup.RollupOutput[] | Rollup.RollupWatcher

/**
 * Programmatically trigger `$ vike build`
 *
 * https://vike.dev/api#build
 */
async function build(options: APIOptions = {}): Promise<{
  rollupOutputClient: RollupOutput
  rollupOutputServer: RollupOutput
}> {
  const { viteConfigEnhanced, vikeConfigGlobal } = await prepareViteApiCall(options.viteConfig, 'build')

  // Build client-side
  const outputClient = await buildVite(viteConfigEnhanced)

  // Build server-side
  const outputServer = await buildVite(setSSR(viteConfigEnhanced))

  // Pre-render
  if (isPrerenderEnabled(vikeConfigGlobal)) {
    const { runPrerenderFromAutoRun } = await import('../prerender/runPrerender.js')
    await runPrerenderFromAutoRun(viteConfigEnhanced)
  }

  return {
    /* We don't return `viteConfig` because `viteConfigEnhanced` is `InlineConfig` not `ResolvedConfig`
    viteConfig: viteConfigEnhanced,
    */
    rollupOutputClient: outputClient,
    rollupOutputServer: outputServer
  }
}

function setSSR(viteConfig: InlineConfig | undefined): InlineConfig {
  return {
    ...viteConfig,
    build: {
      ...viteConfig?.build,
      ssr: true
    }
  }
}
