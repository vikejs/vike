export { getHookTimeouts, getDefaultTimeouts }
export type { HookTimeouts }
import type { ConfigHooksTimeouts, HookName } from '../page-configs/Config.js'

type HookTimeouts = {
  timeoutErr: number
  timeoutWarn: number
}

function getDefaultTimeouts(hookName: HookName): HookTimeouts {
  if (hookName === 'onBeforeRoute') {
    return {
      timeoutErr: 5 * 1000,
      timeoutWarn: 1 * 1000
    }
  }
  if (hookName === 'onBeforePrerender') {
    return {
      timeoutErr: 10 * 60 * 1000,
      timeoutWarn: 30 * 1000
    }
  }
  return {
    timeoutErr: 30 * 1000,
    timeoutWarn: 4 * 1000
  }
}

function getHookTimeouts(configHooksTimeouts: ConfigHooksTimeouts | undefined, hookName: HookName): HookTimeouts {
  const defaultHookTimeouts = getDefaultTimeouts(hookName)
  if (!configHooksTimeouts || !(hookName in configHooksTimeouts)) {
    return defaultHookTimeouts
  }
  const timeoutErr = configHooksTimeouts[hookName]?.error || defaultHookTimeouts.timeoutErr
  const timeoutWarn = configHooksTimeouts[hookName]?.warning || defaultHookTimeouts.timeoutWarn
  return {
    timeoutErr,
    timeoutWarn
  }
}
