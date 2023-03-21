/* Track down log origins
import '../utils/trackLogs'
//*/

export * from '../../public-types'

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

// Help Telefunc detect the user's stack
globalThis._isVitePluginSsr = true
declare global {
  var _isVitePluginSsr: true
}

import { isBrowser, addRequireShim } from './utils'
assertUsage(
  !isBrowser(),
  "It's forbidden to `import { something } from 'vite-plugin-ssr'` in code loaded in the browser: the module 'vite-plugin-ssr' is a server-only module."
)
addRequireShim()

import './page-files/setup'
