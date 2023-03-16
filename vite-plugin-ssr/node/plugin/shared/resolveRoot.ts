export { resolveRoot }
export { assertRoot }

import type { ResolvedConfig, UserConfig } from 'vite'
import { assert, toPosixPath } from '../../runtime/utils'
import path from 'path'

function resolveRoot(config: UserConfig): string {
  // Replicates https://github.com/vitejs/vite/blob/529b0a6f3cfe20b973a91722eba4adaf71224a48/packages/vite/src/node/config.ts#L459-L462
  const root = toPosixPath(config.root ? path.resolve(config.root) : process.cwd())
  return root
}

function assertRoot(root: string, config: ResolvedConfig): void {
  assert(root === config.root)
}
