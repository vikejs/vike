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
    "`import ssr from 'vite-plugin-ssr';` is depecrated: use `import ssr from 'vite-plugin-ssr/plugin';` instead."
  )
  return plugin()
}

// Enable `const ssr = require('vite-plugin-ssr')`
module.exports = Object.assign(exports.default, exports)
