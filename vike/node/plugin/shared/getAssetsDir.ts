export { getAssetsDir }

import type { ResolvedConfig } from 'vite'
import { assertUsage } from '../utils.js'

function getAssetsDir(config: ResolvedConfig) {
  let { assetsDir } = config.build
  assertUsage(assetsDir, `${assetsDir} cannot be an empty string`)
  assetsDir = assetsDir.split(/\/|\\/).filter(Boolean).join('/')
  return assetsDir
}
