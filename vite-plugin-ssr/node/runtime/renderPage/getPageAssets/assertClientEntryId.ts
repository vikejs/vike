export { assertClientEntryId }

import { getGlobalContext } from '../../globalContext'
import { assert, assertPosixPath, isNpmPackageModule } from '../../../utils'
import { isVirtualModuleIdImportPageCode } from '../../../commons/virtual-files/virtualFileImportPageCode'

function assertClientEntryId(id: string) {
  assertPosixPath(id)
  assert(!id.startsWith('/@fs'), id)
  const isPkg = isNpmPackageModule(id)
  assert(
    // Client entry
    id.startsWith('@@vite-plugin-ssr/') ||
      // User files
      id.startsWith('/') ||
      // Code files importer
      isVirtualModuleIdImportPageCode(id) ||
      // Stem packages
      isPkg,
    id
  )
  if (isPkg) {
    const { configVps } = getGlobalContext()
    assert(configVps === null || configVps.extensions.some(({ npmPackageName }) => id.startsWith(npmPackageName)), id)
  }
}
