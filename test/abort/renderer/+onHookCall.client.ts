export default onHookCall

import type { Config } from 'vike/types'
type Hook = Parameters<Extract<Config['onHookCall'], Function>>[0]

async function onHookCall(hook: Hook) {
  await hook.call()
}
