export { createDebugger }

import debug from 'debug'

function createDebugger(
  namespace: `vps:${string}`,
  options: { onlyWhenFocused?: true | string } = {},
): debug.Debugger['log'] {
  let DEBUG: undefined | string
  let DEBUG_FILTER: undefined | string
  // - `process` can be undefined in edge workers
  // - We want bundlers to be able to statically replace `process.env.*`
  try {
    DEBUG = process.env.DEBUG
  } catch {}
  try {
    DEBUG_FILTER = process.env.DEBUG_FILTER_VPS
  } catch {}
  try {
    DEBUG_FILTER ||= process.env.DEBUG_FILTER
  } catch {}

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
