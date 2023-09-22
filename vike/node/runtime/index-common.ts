export { renderPage } from './renderPage.js'
export { escapeInject, dangerouslySkipEscape } from './html/renderHtml.js'
export { pipeWebStream, pipeNodeStream, pipeStream, stampPipe } from './html/stream.js'

// TODO/v1-release: remove
export { injectAssets__public as _injectAssets } from './html/injectAssets/injectAssets__public.js'
// TODO/v1-release: remove
export { createPageRenderer } from '../createPageRenderer.js'

// Help Telefunc detect the user's stack
globalThis._isVitePluginSsr = true
globalThis._isVike = true
declare global {
  var _isVitePluginSsr: true
  var _isVike: true
}

import './page-files/setup.js'
