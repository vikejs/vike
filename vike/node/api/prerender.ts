export { prerender }
export { prerenderFromCLI }
export { _prerender }

import type { PrerenderOptions } from '../prerender/runPrerender.js'
import type { InlineCliConfig } from './utils.js'

async function prerenderFromCLI(config: InlineCliConfig) {
  // skip the api layer of the prerender function and directly pass the prerender config to vike
  // so the exposed prerender api can be preserved
  config.vite ??= {}
  //@ts-ignore
  config.vite._vike_cli = { prerender: config.prerender ?? true }
  return prerender({ viteConfig: config.vite })
}

// only called programatically on user-land or by running vike prerender
// adds the vike plugin if not present
async function prerender(options: PrerenderOptions) {
  const { resolveConfig } = await import('./utils.js')
  const { viteConfig, pageContextInit, onPagePrerender } = options
  const resolved = await resolveConfig({ vite: viteConfig }, 'build')
  return _prerender({ viteConfig: resolved.viteConfig, pageContextInit, onPagePrerender })
}

async function _prerender(options: PrerenderOptions) {
  const { pageContextInit, onPagePrerender, viteConfig } = options
  const { isCliCall } = await import('./utils.js')
  if (isCliCall) {
    const { runPrerender_forceExit, runPrerenderFromCLI } = await import('../prerender/runPrerender.js')
    await runPrerenderFromCLI({ pageContextInit, onPagePrerender, viteConfig })
    runPrerender_forceExit()
  } else {
    const { runPrerenderFromAPI } = await import('../prerender/runPrerender.js')
    await runPrerenderFromAPI({
      pageContextInit,
      onPagePrerender,
      viteConfig
    })
  }
}
