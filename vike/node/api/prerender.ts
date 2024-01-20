export { prerender }
export { _prerender }

import type { PrerenderOptions } from '../prerender/runPrerender.js'

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
