export let logRuntimeMsg: RuntimeLogger | null = null
export { logRuntimeMsg_set }
type RuntimeLogger = (msg: string) => void

function logRuntimeMsg_set(logger: RuntimeLogger) {
  logRuntimeMsg = logger
}
