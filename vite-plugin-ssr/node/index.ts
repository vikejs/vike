export { renderPage } from './renderPage'
export { createPageRenderer } from './createPageRenderer'
export { escapeInject, dangerouslySkipEscape } from './html/renderHtml'
export { pipeWebStream, pipeNodeStream, pipeStream, stampPipe } from './html/stream'
export { injectAssets__public as _injectAssets } from './html/injectAssets'
export { RenderErrorPage } from './renderPage/RenderErrorPage'

export type { PageContextBuiltIn } from './types'

import { setBuildGetters } from './plugin/plugins/importBuild/loadBuild'
export const __internals = { setBuildGetters }

import './page-files/setup'
import { assertUsage, isBrowser } from './utils'

assertUsage(!isBrowser(), 'The `vite-plugin-ssr` module cannot be imported in the browser.')
