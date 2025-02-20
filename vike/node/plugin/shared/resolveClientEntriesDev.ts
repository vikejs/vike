export { resolveClientEntriesDev }
export type ResolveClientEntriesDev = typeof resolveClientEntriesDev

import {
  assert,
  assertPosixPath,
  toPosixPath,
  pathJoin,
  assertIsNpmPackageImport,
  assertIsNotProductionRuntime
} from '../utils.js'
import type { ViteDevServer } from 'vite'
import { createRequire } from 'module'
// @ts-ignore import.meta.url is shimmed at dist/cjs by dist-cjs-fixup.js.
const importMetaUrl: string = import.meta.url
const require_ = createRequire(importMetaUrl)

assertIsNotProductionRuntime()

async function resolveClientEntriesDev(clientEntry: string, viteDevServer: ViteDevServer): Promise<string> {
  let root = viteDevServer.config.root
  assert(root)
  root = toPosixPath(root)

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
    filePath = pathJoin(root, clientEntry)
  } else {
    if (clientEntry.startsWith('@@vike/')) {
      assert(clientEntry.endsWith('.js'))
      try {
        // For Vitest (which doesn't resolve vike to its dist but to its source files)
        // [RELATIVE_PATH_FROM_DIST] Current file: node_modules/vike/node/plugin/shared/resolveClientEntriesDev.js
        filePath = toPosixPath(
          require_.resolve(clientEntry.replace('@@vike/dist/esm/client/', '../../../client/').replace('.js', '.ts'))
        )
      } catch {
        // For users
        // [RELATIVE_PATH_FROM_DIST] Current file: node_modules/vike/dist/esm/node/plugin/shared/resolveClientEntriesDev.js
        filePath = toPosixPath(
          require_.resolve(clientEntry.replace('@@vike/dist/esm/client/', '../../../../../dist/esm/client/'))
        )
      }
    } else {
      assertIsNpmPackageImport(clientEntry)
      filePath = require_.resolve(clientEntry)
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
