import '../page-files/setup.node'
export { createPageRender } from './createPageRender.node'
export { html } from './html/index.node'

import { importBuild } from './importBuild'
export const __private = { importBuild }

// Plugin should be imported from `vite-plugin-ssr/plugin`
import { assertUsage } from '../utils'
export default pluginWrongImport
function pluginWrongImport(): never {
  assertUsage(
    false,
    "`import ssr from 'vite-plugin-ssr';` is depecrated: use `import ssr from 'vite-plugin-ssr/plugin';` instead."
  )
}

// Enable `const ssr = require('vite-plugin-ssr')`
// This lives at the end of the file to ensure it happens after all assignments to `exports`
module.exports = Object.assign(exports.default, exports)
