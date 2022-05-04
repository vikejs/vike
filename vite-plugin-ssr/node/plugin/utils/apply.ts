export { apply }

import type { UserConfig } from 'vite'
import { assert } from '../utils'
import { isViteCliCall } from './isViteCliCall'

function apply(
  when: 'dev' | 'preview',
  { middlewareMode, isViteCli }: { middlewareMode?: false; isViteCli?: true } = {},
) {
  return (config: UserConfig, { command, mode }: { command: string; mode: string }): boolean => {
    assert(command)
    assert(mode)

    if (isViteCli && !isViteCliCall({ command: when })) {
      return false
    }

    if (when === 'dev') {
      if (middlewareMode === false && config?.server?.middlewareMode) {
        return false
      }
      return command === 'serve' && mode === 'development'
    }
    assert(middlewareMode === undefined)

    if (when === 'preview') {
      return command === 'serve' && mode === 'production'
    }

    assert(false)
  }
}
