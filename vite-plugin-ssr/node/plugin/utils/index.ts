export * from '../../../utils/filesystemPathHandling'
export * from '../../../utils/assert'
export * from '../../../utils/slice'
export * from '../../../utils/isObject'
export * from '../../../utils/isCallable'
export * from '../../../utils/projectInfo'
export * from '../../../utils/normalizePath'
export * from '../../../utils/moduleExists'
export * from '../../../utils/isPlainObject'
export * from './isSSR'
export * from './getRoot'
export * from './getFileExtension'
export * from './removeSourceMap'

import { assert } from '../../../utils/assert'

export function apply(when: 'dev' | 'preview') {
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
