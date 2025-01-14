export { prerender }

import { runPrerenderFromAPI, type PrerenderOptions } from '../prerender/runPrerender.js'
import { prepareApiCall } from './prepareApiCall.js'
import type { ResolvedConfig } from 'vite'

async function prerender(options: PrerenderOptions = {}): Promise<{
  viteConfig: ResolvedConfig
}> {
  const { viteConfigEnhanced } = await prepareApiCall(options.viteConfig, 'prerender')
  options.viteConfig = viteConfigEnhanced
  const { viteConfig } = await runPrerenderFromAPI(options)
  return {
    viteConfig
  }
}
