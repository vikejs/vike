export { getManifestFilePathRelative }

import { assert } from '../utils.js'

function getManifestFilePathRelative(manifestConfig: string | boolean) {
  assert(['string', 'boolean'].includes(typeof manifestConfig))
  assert(manifestConfig !== false)
  const manifestFileRelative = typeof manifestConfig === 'string' ? manifestConfig : '.vite/manifest.json'
  return manifestFileRelative
}
