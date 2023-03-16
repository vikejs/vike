export { renderPage } from './renderPage'
export { createPageRenderer } from '../createPageRenderer'
export { escapeInject, dangerouslySkipEscape } from './html/renderHtml'
export { pipeWebStream, pipeNodeStream, pipeStream, stampPipe } from './html/stream'
export { injectAssets__public as _injectAssets } from './html/injectAssets/injectAssets__public'
export { RenderErrorPage } from './renderPage/RenderErrorPage'

export type { PageContextBuiltIn } from '../../shared/types'
export type { InjectFilterEntry } from './html/injectAssets/getHtmlTags'

// Help Telefunc detect the user's stack
globalThis._isVitePluginSsr = true
declare global {
  var _isVitePluginSsr: true
}

import { assertUsage, isBrowser, addRequireShim } from './utils'
assertUsage(!isBrowser(), 'The `vite-plugin-ssr` module cannot be imported in the browser.')
addRequireShim()

import './page-files/setup'
