export { getVikeConfigError }
export { setVikeConfigError }

// This file is used by the server runtime => import utils from runtime/utils.js instead of vite/utils.js
import { getGlobalObject } from '../../../runtime/utils.js'

const globalObject = getGlobalObject('resolveVikeConfigInternal/getVikeConfigError.ts', {
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
