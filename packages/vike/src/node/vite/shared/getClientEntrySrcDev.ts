import '../assertEnvVite.js'

export { getClientEntrySrcDev }
export type GetClientEntrySrcDev = typeof getClientEntrySrcDev

import { assertIsNotProductionRuntime } from '../../../utils/assertSetup.js'
import { assertIsImportPathNpmPackage } from '../../../utils/parseNpmPackage.js'
import { toPosixPath, pathJoin } from '../../../utils/path.js'
import { requireResolveNpmPackage, requireResolveDistFile } from '../../../utils/requireResolve.js'
import { assert } from '../../../utils/assert.js'
import { assertPosixPath } from '../../../utils/path.js'
import type { ViteDevServer } from 'vite'

assertIsNotProductionRuntime()

function getClientEntrySrcDev(clientEntry: string, viteDevServer: ViteDevServer): string {
  let userRootDir = viteDevServer.config.root
  assert(userRootDir)
  userRootDir = toPosixPath(userRootDir)

  // The `?import` suffix is needed for MDX to be transpiled:
  //   - Not transpiled: `/pages/markdown.page.mdx`
  //   - Transpiled: `/pages/markdown.page.mdx?import`
  // But `?import` doesn't work with `/@fs/`:
  //   - Not transpiled: /@fs/home/runner/work/vike/packages/vike/examples/react-full/pages/markdown.page.mdx
  //   - Not transpiled: /@fs/home/runner/work/vike/packages/vike/examples/react-full/pages/markdown.page.mdx?import
  if (clientEntry.endsWith('?import')) {
    assert(clientEntry.startsWith('/'))
    return clientEntry
  }

  assertPosixPath(clientEntry)
  let filePath: string
  if (clientEntry.startsWith('/')) {
    filePath = pathJoin(userRootDir, clientEntry)
  } else {
    if (clientEntry.startsWith('@@vike/')) {
      assert(clientEntry.endsWith('.js'))
      filePath = requireResolveDistFile(`dist/${clientEntry.replace('@@vike/dist/', '') as `${string}.js`}`)
    } else {
      assertIsImportPathNpmPackage(clientEntry)
      filePath = requireResolveNpmPackage({ importPathNpmPackage: clientEntry, userRootDir })
    }
  }

  if (!filePath.startsWith('/')) {
    assert(process.platform === 'win32')
    filePath = '/' + filePath
  }
  filePath = '/@fs' + filePath

  assertPosixPath(filePath)
  return filePath
}
