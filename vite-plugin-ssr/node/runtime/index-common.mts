export { renderPage } from './renderPage.mjs'
export { escapeInject, dangerouslySkipEscape } from './html/renderHtml.mjs'
export { pipeWebStream, pipeNodeStream, pipeStream, stampPipe } from './html/stream.mjs'

// TODO/v1-release: remove
export { injectAssets__public as _injectAssets } from './html/injectAssets/injectAssets__public.mjs'
// TODO/v1-release: remove
export { createPageRenderer } from '../createPageRenderer.mjs'

// Help Telefunc detect the user's stack
globalThis._isVitePluginSsr = true
globalThis._isVike = true
declare global {
  var _isVitePluginSsr: true
  var _isVike: true
}

import './page-files/setup'
