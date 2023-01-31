export { assertClientEntryId }

import { getGlobalContext } from '../../globalContext'
import { assert, assertPosixPath, isNpmPackageModule } from '../../../utils'
import { virtualIdPageConfigCode } from '../../../plugin/plugins/virtualFiles/generatePageConfigsSourceCode/virtualIdPageConfigCode'

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
      id.startsWith(virtualIdPageConfigCode) ||
      // Stem packages
      isPkg,
    id
  )
  if (isPkg) {
    const { configVps } = getGlobalContext()
    assert(configVps === null || configVps.extensions.some(({ npmPackageName }) => id.startsWith(npmPackageName)), id)
  }
}
