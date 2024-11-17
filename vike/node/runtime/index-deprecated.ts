// TODO/v1-release: replace this with:
// assertUsage(false, "`import { something } from 'vike'` doesn't exist: instead import from 'vike/server', 'vike/client', 'vike/plugin', ...")

import { isBrowser } from '../../utils/isBrowser'
import { assertUsage } from '../../utils/assert'
assertUsage(
  !isBrowser(),
  "It's forbidden to `import { something } from 'vike'` on the client-side: the module 'vike' is a server-only module.",
  { showStackTrace: true }
)

export * from './index-common'
export * from '../../types/index-dreprecated'

import { assertWarning } from './utils'
import pc from '@brillout/picocolors'

import { RenderErrorPage as RenderErrorPage_ } from '../../shared/route/abort'
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
      'See https://vike.dev/render'
    ].join('\n'),
    { onlyOnce: true, showStackTrace: true }
  )
  return RenderErrorPage_(...args)
}

assertWarning(
  false,
  [
    'You have following imports which are outdated:',
    pc.red("  import { something } from 'vike'"),
    'Replace them with:',
    pc.green("  import { something } from 'vike/server'"),
    `Or if ${pc.cyan('something')} is a type:`,
    pc.green("  import type { something } from 'vike/types'"),
    "Make sure to import renderPage(), escapeInject, html, dangerouslySkipEscape(), pipeWebStream(), pipeNodeStream(), pipeStream(), stampPipe() from 'vike/server'. (Or inspect the error stack below to find the import causing this warning.)"
  ].join('\n'),
  { showStackTrace: true, onlyOnce: true }
)
