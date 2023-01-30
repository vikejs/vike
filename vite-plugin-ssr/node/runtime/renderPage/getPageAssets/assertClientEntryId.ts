export { assertClientEntryId }

import { getGlobalContext } from '../../globalContext'
import { assert, assertPosixPath, isNpmPackageModule } from '../../../utils'

function assertClientEntryId(id: string) {
  assertPosixPath(id)
  assert(!id.startsWith('/@fs'), id)
  const isPkg = isNpmPackageModule(id)
  assert(id.startsWith('@@vite-plugin-ssr/') || id.startsWith('/') || isPkg, id)
  if (isPkg) {
    const { configVps } = getGlobalContext()
    assert(configVps === null || configVps.extensions.some(({ npmPackageName }) => id.startsWith(npmPackageName)), id)
  }
}
