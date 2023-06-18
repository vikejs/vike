export { renderPage } from './renderPage'
export { escapeInject, dangerouslySkipEscape } from './html/renderHtml'
export { pipeWebStream, pipeNodeStream, pipeStream, stampPipe } from './html/stream'

// TODO/v1-release: remove
export { injectAssets__public as _injectAssets } from './html/injectAssets/injectAssets__public'
// TODO/v1-release: remove
export { createPageRenderer } from '../createPageRenderer'

// Help Telefunc detect the user's stack
globalThis._isVitePluginSsr = true
globalThis._isVike = true
declare global {
  var _isVitePluginSsr: true
  var _isVike: true
}

import { addRequireShim } from './utils'
addRequireShim()

import './page-files/setup'
