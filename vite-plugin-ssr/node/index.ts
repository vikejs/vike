import './page-files/setup'
export { createPageRenderer } from './createPageRenderer'
export { escapeInject, dangerouslySkipEscape } from './html/renderHtml'
export { pipeWebStream, pipeNodeStream } from './html/stream'
export { injectAssets__public as _injectAssets } from './html/injectAssets'

export type { PageContextBuiltIn } from './types'

import { importBuild } from './importBuild'
export const __private = { importBuild }

// Enable `const ssr = require('vite-plugin-ssr')`
// This lives at the end of the file to ensure it happens after all assignments to `exports`
module.exports = Object.assign(exports.default, exports)
