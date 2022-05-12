export { createDebugger }

import debug from 'debug'
const FILTER = process.env.VPS_DEBUG_FILTER || process.env.DEBUG_FILTER
const DEBUG = process.env.DEBUG

function createDebugger(
  namespace: `vps:${string}`,
  options: { onlyWhenFocused?: true | string } = {}
): debug.Debugger['log'] {
  const log = debug(namespace)
  const { onlyWhenFocused } = options
  const focus =
    typeof onlyWhenFocused === 'string' ? onlyWhenFocused : namespace
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
