export { makeFilePathAbsolute }

import path from 'path'
import { ResolvedConfig } from 'vite'
import { assertPosixPath } from '../../utils'
import { toPosixPath, assert } from '../utils'

function makeFilePathAbsolute(filePathRelative: string, config: ResolvedConfig): string {
  assertPosixPath(filePathRelative)
  assert(filePathRelative.startsWith('/'))
  const cwd = config.root
  const filePathAbsolue = toPosixPath(require.resolve(path.join(cwd, filePathRelative)))
  return filePathAbsolue
}
