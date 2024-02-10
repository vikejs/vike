export { assertClientEntryId }

import { assert, assertPosixPath, isNpmPackageImport } from '../../utils.js'
import { isVirtualFileIdPageConfigValuesAll } from '../../../shared/virtual-files/virtualFilePageConfigValuesAll.js'

function assertClientEntryId(id: string) {
  assertPosixPath(id)
  assert(!id.startsWith('/@fs'), id)
  assert(
    // Client entry
    id.startsWith('@@vike/') ||
      // User files
      id.startsWith('/') ||
      // Page code importer
      isVirtualFileIdPageConfigValuesAll(id) ||
      // Import
      isNpmPackageImport(id),
    id
  )
}
