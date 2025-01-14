export { renderPage } from './renderPage.js'
export { escapeInject, dangerouslySkipEscape } from './html/renderHtml.js'
export { pipeWebStream, pipeNodeStream, pipeStream, stampPipe } from './html/stream.js'
export { PROJECT_VERSION as version } from './utils.js'
export { getGlobalContextSync, getGlobalContextAsync } from './globalContext.js'
export { createDevMiddleware_ as createDevMiddleware }

// TODO/v1-release: remove
export { injectAssets__public as _injectAssets } from './html/injectAssets/injectAssets__public.js'
// TODO/v1-release: remove
export { createPageRenderer } from '../createPageRenderer.js'

import type { createDevMiddleware } from '../api/createDevMiddleware.js'
const createDevMiddleware_: typeof createDevMiddleware = async (...args) =>
  (await import('../api/createDevMiddleware.js')).createDevMiddleware(...args)

addEcosystemStamp()

import './page-files/setup.js'

// Used by:
// - Telefunc (to detect the user's stack https://github.com/brillout/telefunc/blob/8288310e88e06a42b710d39c39fb502364ca6d30/telefunc/utils/isVikeApp.ts#L4)
function addEcosystemStamp() {
  const g = globalThis as Record<string, unknown>
  g._isVikeApp =
    /* Don't set to true so that consumers do `!!globalThis._isVikeApp` instead of `globalThis._isVikeApp === true`.
    true
    */
    // We use an object so that we can eventually, in the future, add helpful information as needed. (E.g. the Vike version, or global settings.)
    {}
  // We keep the old stamp for older Telefunc versions
  g._isVitePluginSsr = true
}
