export { renderPage } from './renderPage'
export { createPageRenderer } from './createPageRenderer'
export { escapeInject, dangerouslySkipEscape } from './html/renderHtml'
export { pipeWebStream, pipeNodeStream, pipeStream, stampPipe } from './html/stream'
export { injectAssets__public as _injectAssets } from './html/injectAssets/injectAssets__public'
export { RenderErrorPage } from './renderPage/RenderErrorPage'

export type { PageContextBuiltIn } from './types'
export type { InjectFilterEntry } from './html/injectAssets/getHtmlTags'

import './page-files/setup'
import { assertUsage, isBrowser } from './utils'

assertUsage(!isBrowser(), 'The `vite-plugin-ssr` module cannot be imported in the browser.')
