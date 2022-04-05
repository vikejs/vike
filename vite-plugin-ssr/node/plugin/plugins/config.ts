export { setVitePluginSsrConfig }

import type { Plugin } from 'vite'
import { getPrerenderConfig } from '../../prerender/prerenderConfig'
import { assertUsage, isObject } from '../utils'
import { getPageFilesConfig } from './generateImportGlobs/pageFilesConfig'

function setVitePluginSsrConfig(vitePluginSsrConfig: unknown = {}) {
  assertUsage(isObject(vitePluginSsrConfig), '[vite.config.js][`ssr(options)`] `options` should be an object')
  return {
    name: 'vite-plugin-ssr:setVitePluginSsrConfig',
    enforce: 'pre',
    config() {
      const config = {
        vitePluginSsr: {
          prerender: getPrerenderConfig(vitePluginSsrConfig),
          pageFiles: getPageFilesConfig(vitePluginSsrConfig),
        },
      }
      return config
    },
  } as Plugin
}
