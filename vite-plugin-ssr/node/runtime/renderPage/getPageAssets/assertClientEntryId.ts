export { assertClientEntryId }

import { getGlobalContext } from '../../globalContext.js'
import { assert, assertPosixPath, isNpmPackageImport } from '../../utils.js'
import { isVirtualFileIdImportPageCode } from '../../../shared/virtual-files/virtualFileImportPageCode.js'

function assertClientEntryId(id: string) {
  assertPosixPath(id)
  assert(!id.startsWith('/@fs'), id)
  const isPkg = isNpmPackageImport(id)
  assert(
    // Client entry
    id.startsWith('@@vite-plugin-ssr/') ||
      // User files
      id.startsWith('/') ||
      // Page code importer
      isVirtualFileIdImportPageCode(id) ||
      // Stem packages
      isPkg,
    id
  )
  if (isPkg) {
    const { configVps } = getGlobalContext()
    assert(configVps === null || configVps.extensions.some(({ npmPackageName }) => id.startsWith(npmPackageName)), id)
  }
}
