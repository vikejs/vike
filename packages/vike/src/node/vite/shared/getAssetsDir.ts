export { getAssetsDir }

import { assertUsage } from '../../../utils/assert.js'
import '../assertEnvVite.js'

function getAssetsDir(build: { assetsDir: string }) {
  let { assetsDir } = build
  assertUsage(assetsDir, "Vite's build.assetsDir cannot be an empty string")
  assetsDir = assetsDir.split(/\/|\\/).filter(Boolean).join('/')
  return assetsDir
}
