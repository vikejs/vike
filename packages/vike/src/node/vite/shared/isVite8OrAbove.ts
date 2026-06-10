export { isVite8OrAbove }

import type { ResolvedConfig, UserConfig } from 'vite'
import { assert } from '../../../utils/assert.js'
import { isVersionMatch } from '../../../utils/assertVersion.js'

function isVite8OrAbove(config: UserConfig | ResolvedConfig): boolean {
  const viteVersion = config._viteVersionResolved
  assert(viteVersion)
  return isVersionMatch(viteVersion, ['8.0.0'])
}
