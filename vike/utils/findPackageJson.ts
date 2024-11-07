export { findPackageJson }

import { findFile } from './findFile'
import { createRequire } from 'module'
// @ts-ignore Shimmed by dist-cjs-fixup.js for CJS build.
const importMetaUrl: string = import.meta.url
const require_ = createRequire(importMetaUrl)

function findPackageJson(cwd: string): null | { packageJson: Record<string, unknown>; packageJsonPath: string } {
  const packageJsonPath = findFile('package.json', cwd)
  if (!packageJsonPath) return null
  const packageJson = require_(packageJsonPath)
  return {
    packageJson,
    packageJsonPath
  }
}
