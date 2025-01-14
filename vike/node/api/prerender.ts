export { prerender }

import { runPrerenderFromAPI, type PrerenderOptions } from '../prerender/runPrerender.js'
import { prepareApiCall } from './prepareApiCall.js'

async function prerender(options: PrerenderOptions = {}) {
  const { viteConfigEnhanced } = await prepareApiCall(options.viteConfig, 'prerender')
  options.viteConfig = viteConfigEnhanced
  await runPrerenderFromAPI(options)
}
