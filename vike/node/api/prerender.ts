export { prerender }
export { _prerender }

import { isVikeCli } from './isVikeCli.js'
import { runPrerenderFromAPI, runPrerender_forceExit, runPrerenderFromCLI } from '../prerender/runPrerender.js'
import { resolveConfig } from './resolveConfig.js'
import type { PrerenderOptions } from '../prerender/runPrerender.js'

// only called programatically on user-land or by running vike prerender
// adds the vike plugin if not present
async function prerender(options: PrerenderOptions = {}) {
  const { viteConfig = {}, pageContextInit, onPagePrerender } = options
  const resolved = await resolveConfig(viteConfig, 'build')
  return _prerender({ viteConfig: resolved.viteConfig, pageContextInit, onPagePrerender })
}

async function _prerender(options: PrerenderOptions) {
  const { pageContextInit, onPagePrerender, viteConfig } = options
  if (isVikeCli) {
    await runPrerenderFromCLI({ pageContextInit, onPagePrerender, viteConfig })
    runPrerender_forceExit()
  } else {
    await runPrerenderFromAPI({
      pageContextInit,
      onPagePrerender,
      viteConfig
    })
  }
}
