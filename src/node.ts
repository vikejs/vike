import './user-files/infra.node'
export { createPageRender } from './createPageRender.node'
export { plugin as default } from './plugin.node'
export { html } from './html.node'

// Enable `const ssr = require('vite-plugin-ssr')`
module.exports = Object.assign(exports.default, exports)
