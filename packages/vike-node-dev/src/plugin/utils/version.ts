import { readFileSync } from 'fs'
import { createRequire } from 'module'
import path from 'path'

let version = 'unknown'
let packagePath = ''

try {
  const require_ = createRequire(import.meta.url)
  const resolved = require_.resolve('vike-node')
  packagePath = path.resolve(resolved, '..', '..')
  const packageJsonPath = path.join(packagePath, 'package.json')
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
  version = packageJson.version
} catch (err) {}

export { packagePath, version }
