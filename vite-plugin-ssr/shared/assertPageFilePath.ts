export { assertPageFilePath }

import { assert, isNpmPackageName, assertPosixPath } from './utils'

function assertPageFilePath(filePath: string): void {
  assertPosixPath(filePath)
  assert(filePath.startsWith('/') || isNpmPackageName(filePath.split('/')[0]), { filePath })
}
