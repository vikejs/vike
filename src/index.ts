import './user-files/infra.node'
export { createPageRender } from './createPageRender.node'
export { html } from './html.node'

// Add depecration warning
import { plugin } from './plugin'
import { assertWarning } from './utils'

export default pluginWithWarning
function pluginWithWarning(): ReturnType<typeof plugin> {
  assertWarning(
    false,
    "`import ssr from 'vite-plugin-ssr';` is depecrated: use `import ssr from 'vite-plugin-ssr/plugin';` instead. This will break in a future versions."
  )
  return plugin()
}

// Enable `const ssr = require('vite-plugin-ssr')`
// This lives at the end of the file to ensure it happens after all assignments to `exports`
module.exports = Object.assign(exports.default, exports)
