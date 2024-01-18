export { prerender }
export { _prerender }
export { getPrerenderOptions }

import type { PrerenderOptions } from '../prerender/runPrerender.js'
import type { Options } from './utils.js'

// only called programatically on user-land or by running vike prerender
// adds the vike plugin if not present
// TODO: change the prerender api for v1 : PrerenderOptions -> Options ?????
async function prerender(options: PrerenderOptions) {
  const { resolveConfig } = await import('./utils.js')
  const { viteConfig, ...rest } = options
  const resolved = await resolveConfig({ vite: viteConfig, prerender: rest }, 'build')
  options.viteConfig = resolved.viteConfig
  return _prerender(options)
}

async function _prerender(options: PrerenderOptions) {
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

function getPrerenderOptions(options: Options): PrerenderOptions {
  //@ts-ignore
  const prerenderConfig: Parameters<typeof prerender>[0] = {
    ...(typeof options.prerender === 'object' && options.prerender),
    viteConfig: options.vite
  }

  return prerenderConfig
}
