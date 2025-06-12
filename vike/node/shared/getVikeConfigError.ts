export { getVikeConfigError }
export { getVikeConfigErrorBuild }
export { setVikeConfigError }

import { getGlobalObject } from './utils.js'

const globalObject = getGlobalObject('node/shared/getVikeConfigError.ts', {
  errorRuntime: false as VikeConfigHasError,
  errorBuild: false as VikeConfigHasError,
})

type VikeConfigHasError = false | { err: unknown }
function setVikeConfigError(val: { errorRuntime: VikeConfigHasError } | { errorBuild: VikeConfigHasError }) {
  if ('errorRuntime' in val) globalObject.errorRuntime = val.errorRuntime
  if ('errorBuild' in val) globalObject.errorBuild = val.errorBuild
}
function getVikeConfigError() {
  return globalObject.errorBuild || globalObject.errorRuntime
}
function getVikeConfigErrorBuild() {
  return globalObject.errorBuild
}
