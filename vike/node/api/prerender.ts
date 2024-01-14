export { prerender }

import type { PrerenderOptions } from '../prerender/runPrerender.js'

async function prerender(options: PrerenderOptions) {
  const { resolve } = await import('path')
  const { partial, noExtraDir, base, parallel, outDir, configFile, viteConfig } = options
  const root = options.root && resolve(options.root)

  const { isCliCall } = await import('./utils.js')
  if (isCliCall) {
    const { runPrerender_forceExit, runPrerenderFromCLI } = await import('../prerender/runPrerender.js')
    await runPrerenderFromCLI({ partial, noExtraDir, base, root, parallel, outDir, configFile, viteConfig })
    runPrerender_forceExit()
  } else {
    const { runPrerenderFromAPI } = await import('../prerender/runPrerender.js')
    await runPrerenderFromAPI({ partial, noExtraDir, base, root, parallel, outDir, configFile, viteConfig })
  }
}
