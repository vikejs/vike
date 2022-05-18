export { apply }

import type { UserConfig } from 'vite'
import { assert } from '../utils'
import { isViteCliCall } from './isViteCliCall'

function apply(
  when: 'dev' | 'preview',
  { skipMiddlewareMode, onlyViteCli }: { skipMiddlewareMode?: true; onlyViteCli?: true } = {},
) {
  return (config: UserConfig, { command, mode }: { command: string; mode: string }): boolean => {
    assert(command)
    assert(mode)

    if (onlyViteCli && !isViteCliCall({ command: when })) {
      return false
    }

    if (when === 'dev') {
      if (skipMiddlewareMode === true && config?.server?.middlewareMode) {
        return false
      }
      return command === 'serve' && mode === 'development'
    }
    assert(skipMiddlewareMode === undefined)

    if (when === 'preview') {
      return command === 'serve' && mode === 'production'
    }

    assert(false)
  }
}
