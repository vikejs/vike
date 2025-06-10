export { getVikeConfigError }
export { setVikeConfigError }

import { getGlobalObject } from '../../utils.js'

const globalObject = getGlobalObject('resolveVikeConfigInternal/getVikeConfigError.ts', {
  vikeConfigHasRuntimeError: false as VikeConfigHasError,
  vikeConfigHasBuildError: false as VikeConfigHasError
})

type VikeConfigHasError = false | { err: unknown }
function setVikeConfigError(val: { hasRuntimeError: VikeConfigHasError } | { hasBuildError: VikeConfigHasError }) {
  if ('hasRuntimeError' in val) globalObject.vikeConfigHasRuntimeError = val.hasRuntimeError
  if ('hasBuildError' in val) globalObject.vikeConfigHasBuildError = val.hasBuildError
}
function getVikeConfigError() {
  return globalObject.vikeConfigHasBuildError || globalObject.vikeConfigHasRuntimeError
}
