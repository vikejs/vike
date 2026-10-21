export { isDevCheck }
export { applyDev }
export { applyPreview }

import { assert } from './assert.js'
import type { ConfigEnv } from 'vite'

function isDevCheck(configEnv: ConfigEnv): boolean {
  const { isPreview, command } = configEnv
  assert(typeof isPreview === 'boolean')
  return command === 'serve' && !isPreview
}

function applyDev(_: unknown, env: ConfigEnv): boolean {
  return isDevCheck(env)
}

function applyPreview(_: unknown, env: ConfigEnv): boolean {
  return env.command == 'serve' && !isDevCheck(env)
}
