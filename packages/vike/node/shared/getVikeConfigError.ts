export { getVikeConfigError }
export { getVikeConfigErrorBuild }
export { setVikeConfigError }

import { getViteDevServer } from '../runtime/globalContext.js'
import { getGlobalObject } from './utils.js'

const globalObject = getGlobalObject('node/shared/getVikeConfigError.ts', {
  errorRuntime: false as VikeConfigHasError,
  errorBuild: false as VikeConfigHasError,
})

type VikeConfigHasError = false | { err: unknown }
function setVikeConfigError(val: { errorRuntime: VikeConfigHasError } | { errorBuild: VikeConfigHasError }) {
  const isBrokenPrev = isBroken()
  if ('errorRuntime' in val) globalObject.errorRuntime = val.errorRuntime
  if ('errorBuild' in val) globalObject.errorBuild = val.errorBuild
  const isBrokenNow = isBroken()
  console.log('isBrokenPrev', isBrokenPrev)
  console.log('isBrokenNow', isBrokenNow)
  if (isBrokenNow !== isBrokenPrev) {
    const viteDevServer = getViteDevServer()
    console.log('viteDevServer')
    viteDevServer?.hot.send({ type: 'full-reload' })
  }
}
function isBroken() {
  return !!getVikeConfigError()
}
function getVikeConfigError() {
  return globalObject.errorBuild || globalObject.errorRuntime
}
function getVikeConfigErrorBuild() {
  return globalObject.errorBuild
}
