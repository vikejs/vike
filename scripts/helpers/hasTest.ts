import { readdirSync } from 'fs'
import assert = require('assert')

export { hasTest }

function hasTest(dir: string): boolean {
  const files = readdirSync(dir)
  assert(files.some((file) => file === 'package.json'))
  return files.some((file) => file.includes('.test'))
}
