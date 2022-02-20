export { getRoot }

import { assertUsage, toPosixPath } from '../../utils'
import { isAbsolute } from 'path'

function getRoot(config: { root?: string }): string {
  let root = config.root || process.cwd()
  assertUsage(
    isAbsolute(root),
    // Looking at Vite's source code, Vite does seem to normalize `root`.
    // But this doens't seem to be always the case, see https://github.com/brillout/vite-plugin-ssr/issues/208
    'The `root` config in your `vite.config.js` should be an absolute path. (I.e. `/path/to/root` instead of `../path/to/root`.)',
  )
  root = toPosixPath(root)
  return root
}
