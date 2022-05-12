export { createDebugger }

import debug from 'debug'
import { getEnv } from './getEnv'

function createDebugger(
  namespace: `vps:${string}`,
  options: { onlyWhenFocused?: true | string } = {},
): debug.Debugger['log'] {
  const FILTER = getEnv('VPS_DEBUG_FILTER') || getEnv('DEBUG_FILTER')
  const DEBUG = getEnv('DEBUG')

  const log = debug(namespace)

  const { onlyWhenFocused } = options
  const focus = typeof onlyWhenFocused === 'string' ? onlyWhenFocused : namespace

  return (msg: string, ...args: any[]) => {
    if (FILTER && !msg.includes(FILTER)) {
      return
    }
    if (onlyWhenFocused && !DEBUG?.includes(focus)) {
      return
    }
    log(msg, ...args)
  }
}
