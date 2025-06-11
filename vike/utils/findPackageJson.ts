export { findPackageJson }

import { findFile } from './findFile.js'
import { createRequire } from 'node:module'
// @ts-ignore import.meta.url is shimmed at dist/cjs by dist-cjs-fixup.js.
const importMetaUrl: string = import.meta.url
const require_ = createRequire(importMetaUrl)

function findPackageJson(cwd: string): null | { packageJson: Record<string, unknown>; packageJsonPath: string } {
  const packageJsonPath = findFile('package.json', cwd)
  if (!packageJsonPath) return null
  const packageJson = require_(packageJsonPath)
  return {
    packageJson,
    packageJsonPath,
  }
}
