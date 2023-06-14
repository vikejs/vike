// Non-production logger used for:
//  - Development
//  - Preview
//  - Build
//  - Pre-rendering

export { logConfigInfo }
export { logConfigError }
export { logViteFrameError }
export { logViteAny }
export { clearWithVite }
export { clearWithCondition }
export type { LogInfo }
export type { LogInfoArgs }
export type { LogError }
export type { LogErrorArgs }
export type { LogType }
export type { LogCategory }

import { isRenderErrorPageException } from '../../../shared/route/RenderErrorPage'
import { getGlobalContext, getViteConfig } from '../../runtime/globalContext'
import { setRuntimeLogger } from '../../runtime/renderPage/loggerRuntime'
import {
  assert,
  assertHasLogged,
  assertIsVitePluginCode,
  getAssertMsg,
  hasProp,
  isUserHookError,
  setAssertLogger,
  stripAnsi,
  warnIfObjectIsNotObject
} from '../utils'
import { getAsyncHookStore } from './asyncHook'
import { isErrorDebug } from './isErrorDebug'
import { isFrameError, formatFrameError, type FrameError } from './loggerNotProd/formatFrameError'
import {
  getConfigExecErrIntroMsg,
  getConfigBuildErrFormatted
} from '../plugins/importUserCode/v1-design/transpileAndLoadFile'
import { logWithVikePrefix, logWithVitePrefix, logWithoutPrefix, onErrorLog, onLog } from './loggerNotProd/log'
import type { ResolvedConfig } from 'vite'
import pc from '@brillout/picocolors'
import { setAlreadyLogged } from '../../runtime/renderPage/isNewError'

assertIsVitePluginCode()
setRuntimeLogger(logRuntimeError, logRuntimeInfo)
setAssertLogger((msg, logType) =>
  logWithVikePrefix(typeof msg === 'string' ? msg : msg.message, logType, getCategory())
)

type LogCategory = 'config' | `request(${number})`
type LogType = 'info' | 'warn' | 'error' | 'error-recover'
type LogInfoArgs = Parameters<typeof logRuntimeInfo>
type LogInfo = (...args: LogInfoArgs) => void
type LogErrorArgs = Parameters<typeof logRuntimeError>
type LogError = (...args: LogErrorArgs) => void

function logRuntimeInfo(msg: string, httpRequestId: number, logType: LogType, clearConditions?: ClearConditions) {
  clearWithCondition(clearConditions)
  const category = getCategory(httpRequestId)
  assert(category)
  logWithVikePrefix(msg, logType, category)
}
function logViteAny(
  msg: string,
  logType: LogType,
  httpRequestId: number | null,
  withPrefix: boolean,
  clear: boolean,
  viteConfig: ResolvedConfig
): void {
  if (clear) clearWithVite(viteConfig)
  const category = getCategory(httpRequestId)
  if (withPrefix) {
    logWithVitePrefix(msg, logType, category)
  } else {
    logWithoutPrefix(msg, logType)
  }
}
function logConfigInfo(msg: string, logType: LogType): void {
  const category = getConfigCategory()
  logWithVikePrefix(msg, logType, category)
}

function logRuntimeError(
  err: unknown,
  /** `httpRequestId` is `null` when pre-rendering */
  httpRequestId: number | null
): void {
  setAlreadyLogged(err)
  logErr(err, httpRequestId)
}
function logViteFrameError(err: FrameError): void {
  logErr(err)
}
function logErr(err: unknown, httpRequestId: number | null = null): void {
  warnIfObjectIsNotObject(err)

  if (isRenderErrorPageException(err)) {
    return
  }
  if (getAsyncHookStore()?.hasErrorLogged(err)) {
    return
  }

  const store = getAsyncHookStore()
  store?.addLoggedError(err)

  if (!isErrorDebug()) {
    const { viteDevServer } = getGlobalContext()
    if (viteDevServer) {
      if (hasProp(err, 'stack')) {
        // Apply source maps
        viteDevServer.ssrFixStacktrace(err as Error)
      }
      /* We purposely don't use hasErrorLogged():
         - We don't trust Vite with such details
           - Previously, Vite bug lead to swallowing of errors: https://github.com/vitejs/vite/issues/12631
         - We dedupe Vite logs ourself instead with getAsyncHookStore().hasErrorLogged
      if (viteDevServer.config.logger.hasErrorLogged(err as Error)) {
        return
      }
      */
    }
  }

  const category = getCategory(httpRequestId)

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

  if (!isErrorDebug()) {
    const res = getAssertMsg(err)
    if (res) {
      handleAssertMsg(res, category)
      return
    }
  }

  logErrFallback(err, category)
}
function logConfigError(err: unknown): void {
  warnIfObjectIsNotObject(err)

  const category = getConfigCategory()

  {
    const errIntroMsg = getConfigExecErrIntroMsg(err)
    if (errIntroMsg) {
      clearWithCondition({ clearIfFirstLog: true })
      assert(stripAnsi(errIntroMsg).startsWith('Failed to execute'))
      logWithVikePrefix(errIntroMsg, 'error', category)
      logWithoutPrefix(err, 'error')
      return
    }
  }
  {
    let errMsg = getConfigBuildErrFormatted(err)
    if (errMsg) {
      clearWithCondition({ clearIfFirstLog: true })
      assert(stripAnsi(errMsg).startsWith('Failed to transpile'))
      logWithVikePrefix(errMsg, 'error', category)
      return
    }
  }
  {
    const res = getAssertMsg(err)
    if (res) {
      handleAssertMsg(res, category)
      return
    }
  }

  logErrFallback(err, category)
}
function logErrFallback(err: unknown, category: LogCategory | null) {
  if (category) {
    logWithVikePrefix(pc.red(pc.bold('Error thrown:')), 'error', category)
  }
  logWithoutPrefix(err, 'error')
}

function handleAssertMsg(
  { assertMsg, logType }: { assertMsg: string; logType: LogType },
  category: LogCategory | null
) {
  if (logType === 'error') {
    const [first, ...rest] = assertMsg.split(/(?<=])/)
    assert(first)
    if (first.startsWith('[') && first.split(' ').length <= 2) {
      assertMsg = [pc.red(pc.bold(first)), ...rest].join('')
    }
  }
  logWithVikePrefix(assertMsg, logType, category)
}

function getConfigCategory(): LogCategory {
  const category = getCategory() ?? 'config'
  return category
}

let isFirstLog = true
onLog(() => {
  isFirstLog = false
})
let screenHasErrors = false
onErrorLog(() => {
  screenHasErrors = true
})
type ClearConditions = { clearErrors?: boolean; clearIfFirstLog?: boolean }
function clearWithCondition(conditions: ClearConditions = {}) {
  const { clearErrors, clearIfFirstLog } = conditions
  const clear = (clearErrors && screenHasErrors) || (clearIfFirstLog && isFirstLog && !assertHasLogged())
  if (clear) {
    const viteConfig = getViteConfig()
    assert(viteConfig)
    clearWithVite(viteConfig)
  }
}
function clearWithVite(viteConfig: ResolvedConfig): void {
  screenHasErrors = false
  // We use Vite's logger in order to respect the user's `clearScreen: false` setting
  viteConfig.logger.clearScreen('error')
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

function getCategory(httpRequestId: number | null = null): LogCategory | null {
  const store = getAsyncHookStore()
  if (store?.httpRequestId !== undefined) {
    if (httpRequestId === null) {
      httpRequestId = store.httpRequestId
    } else {
      assert(httpRequestId === store.httpRequestId)
    }
  }
  const category = httpRequestId !== null ? getCategoryRequest(httpRequestId) : null
  return category
}
function getCategoryRequest(httpRequestId: number) {
  return `request(${httpRequestId})` as const
}
