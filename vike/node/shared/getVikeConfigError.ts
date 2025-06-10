export { getVikeConfigError }
export { setVikeConfigError }

import { getGlobalObject } from './utils.js'

const globalObject = getGlobalObject('node/shared/getVikeConfigError.ts', {
  runtimeError: false as VikeConfigHasError,
  buildError: false as VikeConfigHasError
})

type VikeConfigHasError = false | { err: unknown }
function setVikeConfigError(val: { runtimeError: VikeConfigHasError } | { buildError: VikeConfigHasError }) {
  if ('runtimeError' in val) globalObject.runtimeError = val.runtimeError
  if ('buildError' in val) globalObject.buildError = val.buildError
}
function getVikeConfigError() {
  return globalObject.buildError || globalObject.runtimeError
}
