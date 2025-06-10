export { getVikeConfigError }
export { getVikeConfigErrorBuild }
export { setVikeConfigError }

import { getGlobalObject } from './utils.js'

const globalObject = getGlobalObject('node/shared/getVikeConfigError.ts', {
  errorRuntime: false as VikeConfigHasError,
  buildError: false as VikeConfigHasError
})

type VikeConfigHasError = false | { err: unknown }
function setVikeConfigError(val: { errorRuntime: VikeConfigHasError } | { buildError: VikeConfigHasError }) {
  if ('errorRuntime' in val) globalObject.errorRuntime = val.errorRuntime
  if ('buildError' in val) globalObject.buildError = val.buildError
}
function getVikeConfigError() {
  return globalObject.buildError || globalObject.errorRuntime
}
function getVikeConfigErrorBuild() {
  return globalObject.buildError
}
