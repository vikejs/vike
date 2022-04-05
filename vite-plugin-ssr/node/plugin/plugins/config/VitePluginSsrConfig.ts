export { assertVitePluginSsrConfig }
export type { VitePluginSsrConfig }

import { assert, hasProp, checkType } from '../../../utils'

import { PrerenderConfig, getPrerenderConfig } from '../../../prerender/prerenderConfig'
import { getPageFilesConfig, PageFilesConfig } from '../generateImportGlobs/pageFilesConfig'

type VitePluginSsrConfig = {
  pageFiles?: PageFilesConfig
  prerender?: PrerenderConfig
}

function assertVitePluginSsrConfig<T extends Record<string, unknown>>(
  viteConfig: T,
): asserts viteConfig is T & { vitePluginSsr: VitePluginSsrConfig } {
  assert(hasProp(viteConfig, 'vitePluginSsr', 'object'))
  const { vitePluginSsr } = viteConfig

  assert(hasProp(vitePluginSsr, 'prerender', 'object'))
  const prerenderConfig = getPrerenderConfig(vitePluginSsr)
  checkType<PrerenderConfig>(prerenderConfig)

  assert(hasProp(vitePluginSsr, 'pageFiles', 'object'))
  const pageFilesConfig = getPageFilesConfig(vitePluginSsr)
  checkType<PageFilesConfig>(pageFilesConfig)
}
