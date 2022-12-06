export { assertPageFilePath }

import { assert, isNpmPackageModule, assertPosixPath } from './utils'

function assertPageFilePath(filePath: string): void {
  assertPosixPath(filePath)
  assert(filePath.startsWith('/') || isNpmPackageModule(filePath), { filePath })
}
