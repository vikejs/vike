export { apply }

import { assert } from '../utils'

function apply(when: 'dev' | 'preview') {
  return (_config: unknown, { command, mode }: { command: string; mode: string }): boolean => {
    assert(command)
    assert(mode)
    if (when === 'dev') {
      return command === 'serve' && mode === 'development'
    }
    if (when === 'preview') {
      return command === 'serve' && mode === 'production'
    }
    assert(false)
  }
}
