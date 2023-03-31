// TODO/v1-release: remove this file and package.json#exports["."]

export * from './index-common'
// @ts-expect-error
export * from '../../../types-dreprecated.d'

import { assertWarning } from './utils'
import pc from 'picocolors'
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
  "It's forbidden to `import { something } from 'vite-plugin-ssr'` in code loaded in the browser: the module 'vite-plugin-ssr' is a server-only module."
)
