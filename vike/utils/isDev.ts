export { isDevCheck }
export { applyDev }
export { applyPreview }

import { assertUsage } from './assert.js'
import type { ConfigEnv } from 'vite'

function isDevCheck(configEnv: ConfigEnv): boolean {
  const { isPreview, command } = configEnv
  // Note that:
  // - `assertVersion('Vite', version, '5.1.0')` at node/plugin/onLoad.ts isn't enough: https://github.com/vitejs/vite/pull/19355
  // - We'll eventually be able to make this an assert() instead of assertUsage() once Vike requires a Vite version that supports this.meta.viteVersion
  assertUsage(
    typeof isPreview === 'boolean',
    'You are using an old Vite version; make sure to use Vite 5.1.0 or above.'
  )
  return command === 'serve' && !isPreview
}

function applyDev(_: unknown, env: ConfigEnv): boolean {
  return isDevCheck(env)
}

function applyPreview(_: unknown, env: ConfigEnv): boolean {
  return env.command == 'serve' && !isDevCheck(env)
}
