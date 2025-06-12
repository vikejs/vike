export { resolveClientEntriesDev }
export type ResolveClientEntriesDev = typeof resolveClientEntriesDev

import {
  assert,
  assertPosixPath,
  toPosixPath,
  pathJoin,
  assertIsImportPathNpmPackage,
  assertIsNotProductionRuntime,
  requireResolveNpmPackage,
  requireResolveVikeDistFile,
} from '../utils.js'
import type { ViteDevServer } from 'vite'

assertIsNotProductionRuntime()

function resolveClientEntriesDev(clientEntry: string, viteDevServer: ViteDevServer): string {
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
      filePath = requireResolveVikeDistFile(`dist/esm/${clientEntry.replace('@@vike/dist/esm/', '')}`)
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
