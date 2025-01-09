export { prerender }

import { runPrerenderFromAPI, type PrerenderOptions } from '../prerender/runPrerender.js'
import { enhanceViteConfig } from './enhanceViteConfig.js'

async function prerender(options: PrerenderOptions = {}) {
  const { viteConfigEnhanced } = await enhanceViteConfig(options.viteConfig, 'prerender')
  options.viteConfig = viteConfigEnhanced
  await runPrerenderFromAPI(options)
}
