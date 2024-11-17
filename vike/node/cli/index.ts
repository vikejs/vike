// TODO/v1-release: remove this file

import { prerender as prerenderOriginal } from '../prerender/index'
import { assertWarning } from './utils'
export const prerender: typeof prerenderOriginal = (options) => {
  assertWarning(
    false,
    "`import { prerender } from 'vike/cli'` is deprecated in favor of `import { prerender } from 'vike/prerender'``",
    { onlyOnce: true, showStackTrace: true }
  )
  return prerenderOriginal(options)
}
