export { renderPage } from './renderPage.js'
export { escapeInject, dangerouslySkipEscape } from './html/renderHtml.js'
export { pipeWebStream, pipeNodeStream, pipeStream, stampPipe } from './html/stream.js'
export { PROJECT_VERSION as version } from './utils.js'
export { getGlobalContextSync, getGlobalContextAsync } from './globalContext.js'

// TODO/v1-release: remove
export { injectAssets__public as _injectAssets } from './html/injectAssets/injectAssets__public.js'
// TODO/v1-release: remove
export { createPageRenderer } from '../createPageRenderer.js'

addEcosystemStamp()

import './page-files/setup.js'

// Used by:
// - Telefunc (to detect the user's stack)
function addEcosystemStamp() {
  const g = globalThis as Record<string, unknown>
  g._isVikeApp = true
  // We keep the old stamp for older Telefunc versions
  g._isVitePluginSsr = true
}
