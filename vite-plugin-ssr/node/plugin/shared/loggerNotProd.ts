// Non-production logger used for:
//  - Development
//  - Preview
//  - Build
//  - Pre-rendering

export { logInfoNotProd }
export { logErrorNotProd }
export { logConfigError }
export { logAsVite }
export { clearWithVite }
export type { LogInfo }
export type { LogInfoArgs }
export type { LogError }
export type { LogErrorArgs }
export type { LogType }
export type { LogCategory }
export type { HttpRequestId }

import { isRenderErrorPageException } from '../../../shared/route/RenderErrorPage'
import { getGlobalContext, getViteConfig } from '../../runtime/globalContext'
import { setRuntimeLogger } from '../../runtime/renderPage/loggerRuntime'
import { isFirstViteLog } from './loggerVite'
import { assert, assertIsVitePluginCode, hasProp, isUserHookError, stripAnsi, warnIfObjectIsNotObject } from '../utils'
import { getAsyncHookStore } from './asyncHook'
import { isErrorDebug } from './isErrorDebug'
import { isFrameError, formatFrameError } from './loggerNotProd/formatFrameError'
import {
  getConfigExecErrIntroMsg,
  getConfigBuildErrFormatted
} from '../plugins/importUserCode/v1-design/transpileAndLoadFile'
import { logWithVikePrefix, logWithVitePrefix, logWithoutPrefix, onErrorLog } from './loggerNotProd/log'
import type { ResolvedConfig } from 'vite'
import pc from '@brillout/picocolors'

assertIsVitePluginCode()
setRuntimeLogger(logErrorNotProd, logInfoNotProd)

type LogCategory = 'config' | `request(${number})`
type LogType = 'info' | 'warn' | 'error' | 'error-recover'
type LogInfoArgs = Parameters<typeof logInfoNotProd>
type LogInfo = (...args: LogInfoArgs) => void
type LogErrorArgs = [err: unknown, httpRequestId: number | null]
type LogError = (...args: LogErrorArgs) => boolean
/** `httpRequestId` is `null` when pre-rendering */
type HttpRequestId = number | null

let screenHasErrors = false
onErrorLog(() => {
  screenHasErrors = true
})

function logInfoNotProd(msg: string, category: LogCategory, logType: LogType, clearConditions?: ClearConditions) {
  clearWithConditions(clearConditions)
  assert(category)
  logWithVikePrefix(msg, logType, category)
}

function logErrorNotProd(err: unknown, httpRequestId: HttpRequestId): boolean {
  if (isRenderErrorPageException(err)) {
    return false
  }
  if (getAsyncHookStore()?.hasErrorLogged(err)) {
    return false
  }
  logErr(err, httpRequestId, null)
  return true
}
function logErr(err: unknown, httpRequestId: number | null, category: LogCategory | null): void {
  warnIfObjectIsNotObject(err)

  const store = getAsyncHookStore()
  store?.addLoggedError(err)

  if (store?.httpRequestId) {
    if (httpRequestId === null) {
      httpRequestId = store?.httpRequestId
    } else {
      assert(httpRequestId === store.httpRequestId)
    }
  }
  if (!category && httpRequestId) {
    category = getCategoryRequest(httpRequestId)
  }

  {
    const { viteDevServer } = getGlobalContext()
    if (viteDevServer) {
      if (hasProp(err, 'stack')) {
        // Apply source maps
        viteDevServer.ssrFixStacktrace(err as Error)
      }
      /* We purposely don't use hasErrorLogged():
         - We don't trust Vite with such details
           - Previously, Vite bug lead to swallowing of errors: https://github.com/vitejs/vite/issues/12631
         - We dedupe Vite logs ourself instead
      if (viteDevServer.config.logger.hasErrorLogged(err as Error)) {
        return
      }
      */
    }
  }

  {
    const hook = isUserHookError(err)
    if (hook) {
      const { hookName, hookFilePath } = hook
      logWithVikePrefix(pc.red(`Error thrown by hook ${hookName}() (${hookFilePath}):`), 'error', category)
      logWithoutPrefix(err, 'error')
      return
    }
  }

  if (isFrameError(err) && !isErrorDebug()) {
    // We handle transpile errors globally because transpile errors can be thrown not only when calling viteDevServer.ssrLoadModule() but also later when calling user hooks (since Vite loads/transpiles user code in a lazy manner)
    const viteConfig = getViteConfig()
    assert(viteConfig)
    let errMsg = formatFrameError(err, viteConfig.root)
    assert(stripAnsi(errMsg).startsWith('Failed to transpile'))
    logWithVitePrefix(errMsg, 'error', category)
    logErrorDebugNote()
    return
  }

  logErrFallback(err, category)
}

function logErrorDebugNote() {
  if (isErrorDebug()) return
  const msg = pc.dim(
    [
      '=======================================================================',
      "| Error isn't helpful? See https://vite-plugin-ssr.com/errors#verbose |",
      '======================================================================='
    ].join('\n')
  )
  logWithoutPrefix(msg, 'error')
}

function getCategoryRequest(httpRequestId: number) {
  return `request(${httpRequestId})` as const
}

/** Used by Vite logger interceptor, e.g. to log a message with the "[vite]" tag */
function logAsVite(
  msg: string,
  logType: LogType,
  httpRequestId: number | null,
  withPrefix: boolean,
  clear: boolean,
  viteConfig: ResolvedConfig
) {
  if (clear) clearWithVite(viteConfig)
  const category = httpRequestId ? getCategoryRequest(httpRequestId) : null
  if (withPrefix) {
    logWithVitePrefix(msg, logType, category)
  } else {
    logWithoutPrefix(msg, logType)
  }
}

function logConfigError(err: unknown) {
  const store = getAsyncHookStore()
  const category = store?.httpRequestId ? getCategoryRequest(store?.httpRequestId) : 'config'

  {
    const errIntroMsg = getConfigExecErrIntroMsg(err)
    if (errIntroMsg) {
      clearWithConditions({ clearIfFirstLog: true })
      assert(stripAnsi(errIntroMsg).startsWith('Failed to execute'))
      logWithVikePrefix(errIntroMsg, 'error', category)
      logWithoutPrefix(err, 'error')
      return
    }
  }
  {
    let errMsg = getConfigBuildErrFormatted(err)
    if (errMsg) {
      clearWithConditions({ clearIfFirstLog: true })
      assert(stripAnsi(errMsg).startsWith('Failed to transpile'))
      logWithVikePrefix(errMsg, 'error', category)
      return
    }
  }

  logErrFallback(err, category)
}
function logErrFallback(err: unknown, category: LogCategory | null) {
  if (category) {
    logWithVikePrefix(pc.red('Error thrown:'), 'error', category)
  }
  logWithoutPrefix(err, 'error')
}

type ClearConditions = { clearErrors?: boolean; clearIfFirstLog?: boolean }
function clearWithConditions(conditions: ClearConditions = {}) {
  const { clearErrors, clearIfFirstLog } = conditions
  const clear = (clearErrors && screenHasErrors) || (clearIfFirstLog && isFirstViteLog)
  if (clear) {
    const viteConfig = getViteConfig()
    assert(viteConfig)
    clearWithVite(viteConfig)
  }
}
function clearWithVite(viteConfig: ResolvedConfig) {
  screenHasErrors = false
  // We use Vite's logger in order to respect the user's `clearScreen: false` setting
  viteConfig.logger.clearScreen('error')
}
