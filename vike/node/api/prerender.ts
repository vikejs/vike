export { prerender }

import { runPrerenderFromAPI, type PrerenderOptions } from '../prerender/runPrerender.js'
import { clearOperation } from './context.js'
import { prepareViteApiCall } from './prepareViteApiCall.js'
import type { ResolvedConfig } from 'vite'

/**
 * Programmatically trigger `$ vike prerender`
 *
 * https://vike.dev/api#prerender
 */
async function prerender(options: PrerenderOptions = {}): Promise<{
  viteConfig: ResolvedConfig
}> {
  clearOperation() // E.g. when prerender() is called after build()
  const { viteConfigEnhanced } = await prepareViteApiCall(options.viteConfig, 'prerender')
  options.viteConfig = viteConfigEnhanced
  const { viteConfig } = await runPrerenderFromAPI(options)
  return {
    viteConfig
  }
}
