export { isDevCheck }
export { applyDev }
export { applyPreview }

import { assert } from './assert.js'
import { version } from 'vite'
import type { ConfigEnv } from 'vite'

function isDevCheck(configEnv: ConfigEnv): boolean {
  const { isPreview, command } = configEnv
  // Released at vite@5.1.0 which is guaranteed with `assertVersion('Vite', version, '5.1.0')`
  // - Release: https://github.com/vitejs/vite/blob/6f7466e6211027686f40ad7e4ce6ec8477414546/packages/vite/CHANGELOG.md#510-beta4-2024-01-26:~:text=fix(preview)%3A-,set%20isPreview%20true,-(%2315695)%20(93fce55
  // - Surprisingly, this assert() can fail: https://github.com/vikejs/vike/issues/2120
  assert(typeof isPreview === 'boolean', { isPreview, version })
  return command === 'serve' && !isPreview
}

function applyDev(_: unknown, env: ConfigEnv): boolean {
  return isDevCheck(env)
}

function applyPreview(_: unknown, env: ConfigEnv): boolean {
  return env.command == 'serve' && !isDevCheck(env)
}
