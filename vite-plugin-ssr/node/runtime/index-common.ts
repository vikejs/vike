/* Track down log origins
import '../utils/trackLogs'
//*/

export { renderPage } from './renderPage'
export { escapeInject, dangerouslySkipEscape } from './html/renderHtml'
export { pipeWebStream, pipeNodeStream, pipeStream, stampPipe } from './html/stream'

// TODO/v1-release: remove
export { injectAssets__public as _injectAssets } from './html/injectAssets/injectAssets__public'
// TODO/v1-release: remove
export { createPageRenderer } from '../createPageRenderer'

// TODO/v1-release: remove
import { assertWarning } from './utils'
import { RenderErrorPage as RenderErrorPage_ } from '../../shared/route/RenderErrorPage'
import pc from 'picocolors'
export const RenderErrorPage: typeof RenderErrorPage_ = (...args) => {
  assertWarning(
    false,
    [
      'This import is deprecated:',
      pc.red("  import { RenderErrorPage } from 'vite-plugin-ssr'"),
      'Replace it with:',
      pc.green("  import { RenderErrorPage } from 'vite-plugin-ssr/RenderErrorPage'")
    ].join('\n'),
    { onlyOnce: true, showStackTrace: true }
  )
  return RenderErrorPage_(...args)
}

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
