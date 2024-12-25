export { isDev3 }

import { assert } from './assert.js'

// ********
// Method 3 - most reliable, requires newer Vite version
// ********
import type { ConfigEnv } from 'vite'
function isDev3(configEnv: ConfigEnv): boolean {
  const { isPreview, command } = configEnv
  if (command !== 'serve') return false

  // - Released at `vite@5.1.0`: https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#510-beta4-2024-01-26:~:text=fix(preview)%3A%20set%20isPreview%20true%20(%2315695)%20(93fce55)%2C%20closes%20%2315695
  assert(typeof isPreview === 'boolean')

  return !isPreview
}
