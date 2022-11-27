export { assertPageFilePath }

import { assert, isNpmPackageModulePath, assertPosixPath } from './utils'

function assertPageFilePath(filePath: string): void {
  assertPosixPath(filePath)
  assert(filePath.startsWith('/') || isNpmPackageModulePath(filePath), { filePath })
}
