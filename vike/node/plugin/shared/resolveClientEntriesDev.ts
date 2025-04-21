export { resolveClientEntriesDev }
export type ResolveClientEntriesDev = typeof resolveClientEntriesDev

import {
  assert,
  assertPosixPath,
  toPosixPath,
  pathJoin,
  assertIsImportPathNpmPackage,
  assertIsNotProductionRuntime,
  requireResolve,
  requireResolveNonUserFile
} from '../utils.js'
import type { ViteDevServer } from 'vite'
// @ts-ignore import.meta.url is shimmed at dist/cjs by dist-cjs-fixup.js.
const importMetaUrl: string = import.meta.url

assertIsNotProductionRuntime()

async function resolveClientEntriesDev(clientEntry: string, viteDevServer: ViteDevServer): Promise<string> {
  let userRootDir = viteDevServer.config.root
  assert(userRootDir)
  userRootDir = toPosixPath(userRootDir)

  // The `?import` suffix is needed for MDX to be transpiled:
  //   - Not transpiled: `/pages/markdown.page.mdx`
  //   - Transpiled: `/pages/markdown.page.mdx?import`
  // But `?import` doesn't work with `/@fs/`:
  //   - Not transpiled: /@fs/home/runner/work/vike/vike/examples/react-full/pages/markdown.page.mdx
  //   - Not transpiled: /@fs/home/runner/work/vike/vike/examples/react-full/pages/markdown.page.mdx?import
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
      let filePath_: string | null
      if (!importMetaUrl.includes('/dist/')) {
        // For Vitest (which doesn't resolve vike to its dist but to its source files).
        // [RELATIVE_PATH_FROM_DIST] Current file: node_modules/vike/node/plugin/shared/resolveClientEntriesDev.js
        filePath_ = requireResolveNonUserFile(
          clientEntry.replace('@@vike/dist/esm/client/', '../../../client/').replace('.js', '.ts'),
          { importMetaUrl }
        )
      } else {
        // For most use cases.
        // [RELATIVE_PATH_FROM_DIST] Current file: node_modules/vike/dist/esm/node/plugin/shared/resolveClientEntriesDev.js
        filePath_ = requireResolveNonUserFile(
          clientEntry.replace('@@vike/dist/esm/client/', '../../../../../dist/esm/client/'),
          { importMetaUrl }
        )
      }
      assert(filePath_)
      filePath = filePath_
    } else {
      assertIsImportPathNpmPackage(clientEntry)
      filePath = requireResolve({ importPath: clientEntry, userRootDir })
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
