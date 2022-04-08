export { setVitePluginSsrConfig }

import type { Plugin } from 'vite'
import { getPrerenderConfig } from '../../prerender/prerenderConfig'
import { hasProp } from '../../utils'
import { assertUsage, isObject } from '../utils'
import { getPageFilesConfig } from './generateImportGlobs/pageFilesConfig'

function setVitePluginSsrConfig(vitePluginSsrConfig: unknown = {}) {
  assertUsage(isObject(vitePluginSsrConfig), '[vite.config.js][`ssr(options)`] `options` should be an object')
  assertUsage(
    vitePluginSsrConfig.disableBuildChaining === undefined ||
      hasProp(vitePluginSsrConfig, 'disableBuildChaining', 'boolean'),
    '[vite.config.js][`ssr({ disableBuildChaining })`] `disableBuildChaining` should be undefined or a boolean',
  )
  return {
    name: 'vite-plugin-ssr:setVitePluginSsrConfig',
    enforce: 'pre',
    config() {
      const config = {
        vitePluginSsr: {
          prerender: getPrerenderConfig(vitePluginSsrConfig),
          pageFiles: getPageFilesConfig(vitePluginSsrConfig),
          disableBuildChaining: vitePluginSsrConfig.disableBuildChaining ?? false,
        },
      }
      return config
    },
  } as Plugin
}
