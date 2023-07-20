// TODO/v1-release: replace this with:
// assertUsage(false, "`import { something } from 'vite-plugin-ssr'` doesn't exist: instead import from 'vite-plugin-ssr/server', 'vite-plugin-ssr/client', 'vite-plugin-ssr/plugin', ...")

export * from './index-common'
export * from '../../types/index-dreprecated'

import { assertWarning } from './utils'
import pc from '@brillout/picocolors'

import { RenderErrorPage as RenderErrorPage_ } from '../../shared/route/abort'
/** @deprecated
 * Replace:
 *   ```
 *   import { RenderErrorPage } from 'vite-plugin-ssr'
 *   ```
 * With:
 *   ```
 *   import { render } from 'vite-plugin-ssr/abort'
 *   ```
 *
 * See https://vite-plugin-ssr.com/render
 */
export const RenderErrorPage = (...args: Parameters<typeof RenderErrorPage_>): Error => {
  assertWarning(
    false,
    [
      'Replace:',
      pc.red("  import { RenderErrorPage } from 'vite-plugin-ssr'"),
      'With:',
      pc.green("  import { render } from 'vite-plugin-ssr/abort'"),
      "See https://vite-plugin-ssr.com/render"
    ].join('\n'),
    { onlyOnce: true, showStackTrace: true }
  )
  return RenderErrorPage_(...args)
}

assertWarning(
  false,
  [
    'You have following imports which are outdated:',
    pc.red("  import { something } from 'vite-plugin-ssr'"),
    'Replace them with:',
    pc.green("  import { something } from 'vite-plugin-ssr/server'"),
    'Or if `something` is a type:',
    pc.green("  import type { something } from 'vite-plugin-ssr/types'"),
    "Make sure to import renderPage(), escapeInject, html, dangerouslySkipEscape(), pipeWebStream(), pipeNodeStream(), pipeStream(), stampPipe() from 'vite-plugin-ssr/server'. (Or inspect the error stack below to find the import causing this warning.)"
  ].join('\n'),
  { showStackTrace: true, onlyOnce: true }
)

import { isBrowser, assertUsage } from './utils'
assertUsage(
  !isBrowser(),
  "It's forbidden to `import { something } from 'vite-plugin-ssr'` in code loaded in the browser: the module 'vite-plugin-ssr' is a server-only module.",
  { showStackTrace: true }
)
