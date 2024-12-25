export { isDevCheck }

import { assert } from './assert.js'

import type { ConfigEnv } from 'vite'
function isDevCheck(configEnv: ConfigEnv): boolean {
  const { isPreview, command } = configEnv
  if (command !== 'serve') return false
  // Released at vite@5.1.0 which is guaranteed with `assertVersion('Vite', version, '5.1.0')`
  assert(typeof isPreview === 'boolean')
  return !isPreview
}
