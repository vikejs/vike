export { assertPageFilePath }

import { assert, isNpmPackageImport, assertPosixPath } from './utils'

function assertPageFilePath(filePath: string): void {
  assertPosixPath(filePath)
  assert(filePath.startsWith('/') || isNpmPackageImport(filePath), { filePath })
}
