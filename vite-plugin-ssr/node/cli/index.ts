// TODO/v1-release: remove this file

import { prerender as prerenderOriginal } from '../prerender/index.js'
import { assertWarning } from './utils.js'
export const prerender: typeof prerenderOriginal = (options) => {
  assertWarning(
    false,
    "`import { prerender } from 'vite-plugin-ssr/cli'` is deprecated in favor of `import { prerender } from 'vite-plugin-ssr/prerender'``",
    { onlyOnce: true, showStackTrace: true }
  )
  return prerenderOriginal(options)
}
