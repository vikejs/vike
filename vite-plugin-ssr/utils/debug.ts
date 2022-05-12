export { createDebugger }

import debug from 'debug'
import { getEnv } from './getEnv'

function createDebugger(
  namespace: `vps:${string}`,
  options: { onlyWhenFocused?: true | string } = {},
): debug.Debugger['log'] {
  const DEBUG = getEnv('DEBUG')
  const DEBUG_FILTER = getEnv('VPS_DEBUG_FILTER') || getEnv('DEBUG_FILTER')

  const log = debug(namespace)

  const { onlyWhenFocused } = options
  const focus = typeof onlyWhenFocused === 'string' ? onlyWhenFocused : namespace

  return (msg: string, ...args: any[]) => {
    if (DEBUG_FILTER && !msg.includes(DEBUG_FILTER)) {
      return
    }
    if (onlyWhenFocused && !DEBUG?.includes(focus)) {
      return
    }
    log(msg, ...args)
  }
}
