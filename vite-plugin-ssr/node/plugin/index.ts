import { Plugin } from 'vite'
import { assertUsage } from '../../shared/utils'
import { build } from './build'
import { dev } from './dev'
import { manifest } from './manifest'
import { packageJsonFile } from './packageJsonFile'
import { importBuild } from 'vite-plugin-import-build'
import { getImportBuildCode } from './getImportBuildCode'

export default plugin
export { plugin }
export { plugin as ssr }

// Return as `any` to avoid Plugin type mismatches when there are multiple Vite versions installed
function plugin(): any {
  const plugins: Plugin[] = [dev(), build(), manifest(), importBuild(getImportBuildCode()), packageJsonFile()]
  return plugins as any
}

// Enable `const ssr = require('vite-plugin-ssr/plugin')`
// This lives at the end of the file to ensure it happens after all assignments to `exports`
module.exports = Object.assign(exports.default, exports)

Object.defineProperty(plugin, 'apply', {
  enumerable: true,
  get: () => {
    assertUsage(
      false,
      'Make sure to instantiate the `ssr` plugin (`import ssr from "vite-plugin-ssr"`): include `ssr()` instead of `ssr` in the `plugins` list of your `vite.config.js`.'
    )
  }
})
