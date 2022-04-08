import { assertUsage, hasProp, isObject } from '../utils'

export type { PrerenderConfig }
export { getPrerenderConfig }

type PrerenderConfig =
  | boolean
  | {
      partial?: boolean
      noExtraDir?: boolean
      parallel?: number
    }

function getPrerenderConfig(vitePluginSsrConfig: Record<string, unknown>): PrerenderConfig {
  if (vitePluginSsrConfig.prerender === undefined) {
    return false
  }
  assertUsage(
    hasProp(vitePluginSsrConfig, 'prerender', 'object') || hasProp(vitePluginSsrConfig, 'prerender', 'boolean'),
    '[vite.config.js][`ssr({ prerender })`] `prerender` should be a boolean or an object',
  )
  if (!isObject(vitePluginSsrConfig.prerender)) {
    return vitePluginSsrConfig.prerender
  }
  const prerenderConfig: PrerenderConfig = {
    partial: undefined,
    noExtraDir: undefined,
    parallel: undefined,
  }
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
