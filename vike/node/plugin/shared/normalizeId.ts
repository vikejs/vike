export { normalizeId }

import { toPosixPath } from '../utils.js'

// In principle Vite/Rollup should always normalize the `id` in `transform(code, id)` but it seems to not always do it.
// https://github.com/vikejs/vike/issues/1935
function normalizeId(id: string): string {
  return toPosixPath(id)
}
