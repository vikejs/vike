import { isBrowser } from '../../utils/isBrowser.js'
import { assert } from '../../utils/assert.js'
assert(!isBrowser())

export { renderPageServer as renderPage } from './renderPageServer.js'
export { escapeInject, dangerouslySkipEscape } from './renderPageServer/html/renderHtml.js'
export { pipeWebStream, pipeNodeStream, pipeStream, stampPipe } from './renderPageServer/html/stream.js'
export { PROJECT_VERSION as version } from './utils.js'
export { getGlobalContext, getGlobalContextSync, getGlobalContextAsync } from './globalContext.js'
export { createDevMiddleware } from './createDevMiddleware.js'

// TO-DO/next-major-release: remove
// Deprecated exports
export * from '../../types/index-dreprecated.js'
export { injectAssets__public as _injectAssets } from './renderPageServer/html/injectAssets/injectAssets__public.js'
export { createPageRenderer } from '../createPageRenderer.js'
import { assertWarning } from './utils.js'
import pc from '@brillout/picocolors'
import { RenderErrorPage as RenderErrorPage_ } from '../../shared-server-client/route/abort.js'
/** @deprecated
 * Replace:
 *   ```
 *   import { RenderErrorPage } from 'vike'
 *   ```
 * With:
 *   ```
 *   import { render } from 'vike/abort'
 *   ```
 *
 * See https://vike.dev/render
 */
export const RenderErrorPage = (...args: Parameters<typeof RenderErrorPage_>): Error => {
  assertWarning(
    false,
    [
      'Replace:',
      pc.red("  import { RenderErrorPage } from 'vike'"),
      'With:',
      pc.green("  import { render } from 'vike/abort'"),
      'See https://vike.dev/render',
    ].join('\n'),
    { onlyOnce: true, showStackTrace: true },
  )
  return RenderErrorPage_(...args)
}
