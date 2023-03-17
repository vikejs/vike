/* Track down log origins
import '../utils/trackLogs'
//*/

export { renderPage } from './renderPage'
export { createPageRenderer } from '../createPageRenderer'
export { escapeInject, dangerouslySkipEscape } from './html/renderHtml'
export { pipeWebStream, pipeNodeStream, pipeStream, stampPipe } from './html/stream'
export { injectAssets__public as _injectAssets } from './html/injectAssets/injectAssets__public'

import { assertUsage, assertWarning } from './utils'
import { RenderErrorPage as RenderErrorPage_ } from '../../shared/route/RenderErrorPage'
import pc from 'picocolors'
export const RenderErrorPage: typeof RenderErrorPage_ = (...args) => {
  assertWarning(
    false,
    [
      'This import is deprecated:',
      pc.cyan("  import { RenderErrorPage } from 'vite-plugin-ssr'"),
      'Replace it with:',
      pc.cyan("  import { RenderErrorPage } from 'vite-plugin-ssr/RenderErrorPage'")
    ].join('\n'),
    { onlyOnce: true, showStackTrace: true }
  )
  return RenderErrorPage_(...args)
}

export type { PageContextBuiltIn } from '../../shared/types'
export type { InjectFilterEntry } from './html/injectAssets/getHtmlTags'

// Help Telefunc detect the user's stack
globalThis._isVitePluginSsr = true
declare global {
  var _isVitePluginSsr: true
}

import { isBrowser, addRequireShim } from './utils'
assertUsage(!isBrowser(), 'The `vite-plugin-ssr` module cannot be imported in the browser.')
addRequireShim()

import './page-files/setup'
