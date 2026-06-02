export { prerender }

import { runPrerenderFromAPI } from '../prerender/runPrerenderEntry.js'
import type { PrerenderOptions } from '../prerender/runPrerender.js'
import { prepareViteApiCall } from './prepareViteApiCall.js'
import type { ResolvedConfig } from 'vite'
import './assertEnvApiDevAndProd.js'

/**
 * Programmatically trigger `$ vike prerender`
 *
 * https://vike.dev/api#prerender
 */
async function prerender(options: PrerenderOptions = {}): Promise<{
  viteConfig: null | ResolvedConfig
}> {
  const { viteConfigFromUser } = await prepareViteApiCall(options, 'prerender')
  options.viteConfig = viteConfigFromUser
  const { viteConfig } = await runPrerenderFromAPI(options)
  return {
    viteConfig,
  }
}
