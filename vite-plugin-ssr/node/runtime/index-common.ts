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
import pc from '@brillout/picocolors'
/** @deprecated
 * Replace:
 *   ```
 *   import { RenderErrorPage } from 'vite-plugin'
 *   ```
 * With:
 *   ```
 *   import { RenderErrorPage } from 'vite-plugin/RenderErrorPage'
 *   ```
 */
export const RenderErrorPage = (...args: Parameters<typeof RenderErrorPage_>): Error => {
  assertWarning(
    false,
    [
      'Replace:',
      pc.red("  import { RenderErrorPage } from 'vite-plugin-ssr'"),
      'With:',
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
