// TODO/v1-release: remove this file and package.json#exports["."], add add propper package.json#exports["."].types and package.json#types

export * from './index-common'
export * from '../public-types'

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
    pc.green("  import type { something } from 'vite-plugin-ssr'"),
    "(Server exports now live at 'vite-plugin/server' while all types are now exported at 'vite-plugin-ssr'.)"
  ].join('\n'),
  { showStackTrace: true, onlyOnce: true }
)

import { isBrowser, assertUsage } from './utils'
assertUsage(
  !isBrowser(),
  "It's forbidden to `import { something } from 'vite-plugin-ssr'` in code loaded in the browser: the module 'vite-plugin-ssr' is a server-only module."
)
