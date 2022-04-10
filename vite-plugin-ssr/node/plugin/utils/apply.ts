export { apply }

import type { UserConfig } from 'vite'
import { assert } from '../utils'

function apply(when: 'dev' | 'preview', { middlewareMode }: { middlewareMode?: false } = {}) {
  return (config: UserConfig, { command, mode }: { command: string; mode: string }): boolean => {
    assert(command)
    assert(mode)
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
