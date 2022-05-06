export { renderPage } from './renderPage'
export { createPageRenderer } from './createPageRenderer'
export { escapeInject, dangerouslySkipEscape } from './html/renderHtml'
export { pipeWebStream, pipeNodeStream, pipeStream, stampStreamPipe } from './html/stream'
export { injectAssets__public as _injectAssets } from './html/injectAssets'
export { RenderErrorPage } from './renderPage/RenderErrorPage'

export type { PageContextBuiltIn } from './types'

import { setDistEntries } from './plugin/plugins/distEntries/loadDistEntries'
export const __internals = { setDistEntries }

import './page-files/setup'
import '../shared/assertSingleVersion'
import { assertUsage, isBrowser } from './utils'

assertUsage(!isBrowser(), 'The `vite-plugin-ssr` module cannot be imported in the browser.')
