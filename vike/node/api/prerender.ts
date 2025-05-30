export { prerender }

import { runPrerenderFromAPI, type PrerenderOptions } from '../prerender/runPrerender.js'
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
  const { viteConfigFromUserEnhanced } = await prepareViteApiCall(options, 'prerender')
  options.viteConfig = viteConfigFromUserEnhanced
  const { viteConfig } = await runPrerenderFromAPI(options)
  return {
    viteConfig
  }
}
