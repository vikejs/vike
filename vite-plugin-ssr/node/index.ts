// TODO: move this file to ./runtime/index.ts

export { renderPage } from './runtime/renderPage'
export { createPageRenderer } from './createPageRenderer'
export { escapeInject, dangerouslySkipEscape } from './runtime/html/renderHtml'
export { pipeWebStream, pipeNodeStream, pipeStream, stampPipe } from './runtime/html/stream'
export { injectAssets__public as _injectAssets } from './runtime/html/injectAssets/injectAssets__public'
export { RenderErrorPage } from './runtime/renderPage/RenderErrorPage'

export type { PageContextBuiltIn } from './types'
export type { InjectFilterEntry } from './runtime/html/injectAssets/getHtmlTags'

// Help Telefunc detect the user's stack
globalThis._isVitePluginSsr = true
declare global {
  var _isVitePluginSsr: true
}

import { assertUsage, isBrowser, addRequireShim } from './utils'
assertUsage(!isBrowser(), 'The `vite-plugin-ssr` module cannot be imported in the browser.')
addRequireShim()

import './runtime/page-files/setup'
