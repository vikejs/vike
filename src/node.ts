import './user-files/infra.node'
export { createRender } from './createRender.node'
export { plugin as default } from './plugin.node'
export { html } from './html.node'

// Enable `const ssr = require('vite-plugin-ssr')`
module.exports = Object.assign(exports.default, exports)
