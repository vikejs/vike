import { assertUsage, hasProp } from '../utils'

export type { PrerenderConfig }
export { getPrerenderConfig }

type PrerenderConfig = {
  partial?: boolean
  noExtraDir?: boolean
  parallel?: number
}

function getPrerenderConfig(vitePluginSsrConfig: Record<string, unknown>) {
  const prerenderConfig: PrerenderConfig = {
    partial: undefined,
    noExtraDir: undefined,
    parallel: undefined,
  }
  if (vitePluginSsrConfig.prerender === undefined) {
    return prerenderConfig
  }
  assertUsage(
    hasProp(vitePluginSsrConfig, 'prerender', 'object'),
    '[vite.config.js][`ssr({ prerender })`] `prerender` should be an object',
  )
  const { prerender } = vitePluginSsrConfig
  if (prerender.partial !== undefined) {
    assertUsage(
      hasProp(prerender, 'partial', 'boolean'),
      '[vite.config.js][`ssr({ prerender: { partial } })`] `partial` should be a boolean',
    )
    prerenderConfig.partial = prerender.partial
  }
  if (prerender.noExtraDir !== undefined) {
    assertUsage(
      hasProp(prerender, 'noExtraDir', 'boolean'),
      '[vite.config.js][`ssr({ prerender: { noExtraDir } })`] `noExtraDir` should be a boolean',
    )
    prerenderConfig.noExtraDir = prerender.noExtraDir
  }
  if (prerender.parallel !== undefined) {
    assertUsage(
      hasProp(prerender, 'parallel', 'number'),
      '[vite.config.js][`ssr({ prerender: { parallel } })`] `parallel` should be a number',
    )
    prerenderConfig.parallel = prerender.parallel
  }
  return prerenderConfig
}
