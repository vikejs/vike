export { prerender }

import { runPrerenderFromAPI, type PrerenderOptionsAPI } from '../prerender/runPrerenderEntry.js'
import { prepareViteApiCall } from './prepareViteApiCall.js'
import type { ResolvedConfig } from 'vite'

/**
 * Programmatically trigger `$ vike prerender`
 *
 * https://vike.dev/api#prerender
 */
async function prerender(options: PrerenderOptionsAPI = {}): Promise<{
  viteConfig: ResolvedConfig | null
}> {
  const { viteConfigFromUserEnhanced } = await prepareViteApiCall(options, 'prerender')
  options.viteConfig = viteConfigFromUserEnhanced
  const { viteConfig } = await runPrerenderFromAPI(options)
  return {
    viteConfig
  }
}
