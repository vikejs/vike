import { Plugin } from 'vite'
import { assertUsage } from '../utils'
import { buildPlugin } from './buildPlugin'
import { devPlugin } from './devPlugin'
import { manifestPlugin } from './manifestPlugin'
import { importerPlugin } from './importerPlugin'

export { plugin }
export default plugin

function plugin(): Plugin[] {
  return [devPlugin(), buildPlugin(), manifestPlugin(), importerPlugin()]
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
