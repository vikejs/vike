export let logRuntimeMsg: RuntimeLogger | null = null
export { logRuntimeMsg_set }

import type { LogArgs } from '../../plugin/shared/devLogger'

type RuntimeLogger = (...args: LogArgs) => void

function logRuntimeMsg_set(logger: RuntimeLogger) {
  logRuntimeMsg = logger
}
