// TODO/v1-release: remove

export { assertPageFilePath }

import { assertPosixPath } from './utils'

function assertPageFilePath(filePath: string): void {
  assertPosixPath(filePath)
  /* This assert() is skipped to reduce client-side bundle size
  assert(filePath.startsWith('/') || isNpmPackageImport(filePath), { filePath })
  */
}
