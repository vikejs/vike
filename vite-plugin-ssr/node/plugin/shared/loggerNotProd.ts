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
  getAssertErrMsg,
  hasProp,
  isUserHookError,
  setAssertLogger,
  stripAnsi,
  warnIfObjectIsNotObject
} from '../utils'
import { getHttpRequestAsyncStore } from './getHttpRequestAsyncStore'
import { isErrorDebug } from './isErrorDebug'
import {
  isErrorWithCodeSnippet,
  getPrettyErrorWithCodeSnippet,
  type ErrorWithCodeSnippet
} from './loggerNotProd/errorWithCodeSnippet'
import {
  getConfigExececutionErrorIntroMsg,
  getConfigBuildErrorFormatted
} from '../plugins/importUserCode/v1-design/transpileAndLoadFile'
import { logWithVikePrefix, logWithVitePrefix, logDirectly, onErrorLog, onLog } from './loggerNotProd/log'
import type { ResolvedConfig } from 'vite'
import pc from '@brillout/picocolors'
import { setAlreadyLogged } from '../../runtime/renderPage/isNewError'

assertIsVitePluginCode()
setRuntimeLogger(logRuntimeError, logRuntimeInfo)
setAssertLogger(assertLogger)

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
    logDirectly(msg, logType)
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
  logErr(err, httpRequestId)
}
function logViteFrameError(err: ErrorWithCodeSnippet): void {
  logErr(err)
}
function logErr(err: unknown, httpRequestId: number | null = null): void {
  setAlreadyLogged(err)
  warnIfObjectIsNotObject(err)

  if (isRenderErrorPageException(err)) {
    return
  }
  if (getHttpRequestAsyncStore()?.shouldErrorBeSwallowed(err)) {
    return
  }

  const store = getHttpRequestAsyncStore()
  store?.markErrorAsLogged(err)

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
         - We dedupe Vite logs ourself instead with getHttpRequestAsyncStore().shouldErrorBeSwallowed()
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
      logWithVikePrefix(
        pc.red(`Following error was thrown by the ${hookName}() hook defined at ${hookFilePath}`),
        'error',
        category
      )
      logDirectly(err, 'error')
      return
    }
  }

  if (isErrorWithCodeSnippet(err) && !isErrorDebug()) {
    // We handle transpile errors globally because transpile errors can be thrown not only when calling viteDevServer.ssrLoadModule() but also later when calling user hooks (since Vite loads/transpiles user code in a lazy manner)
    const viteConfig = getViteConfig()
    assert(viteConfig)
    let errMsg = getPrettyErrorWithCodeSnippet(err, viteConfig.root)
    assert(stripAnsi(errMsg).startsWith('Failed to transpile'))
    logWithVitePrefix(errMsg, 'error', category)
    logErrorDebugNote()
    return
  }

  if (!isErrorDebug()) {
    const logged = handleAssertMsg(err, category)
    if (logged) return
  }

  logErrFallback(err, category)
}
function logConfigError(err: unknown): void {
  warnIfObjectIsNotObject(err)

  const category = getConfigCategory()

  {
    const errIntroMsg = getConfigExececutionErrorIntroMsg(err)
    if (errIntroMsg) {
      clearWithCondition({ clearIfFirstLog: true })
      assert(stripAnsi(errIntroMsg).startsWith('Failed to execute'))
      logWithVikePrefix(errIntroMsg, 'error', category)
      logDirectly(err, 'error')
      return
    }
  }
  {
    let errMsg = getConfigBuildErrorFormatted(err)
    if (errMsg) {
      clearWithCondition({ clearIfFirstLog: true })
      assert(stripAnsi(errMsg).startsWith('Failed to transpile'))
      logWithVikePrefix(errMsg, 'error', category)
      return
    }
  }
  {
    const logged = handleAssertMsg(err, category)
    if (logged) return
  }

  logErrFallback(err, category)
}
function logErrFallback(err: unknown, category: LogCategory | null) {
  if (category) {
    logWithVikePrefix(pc.red(pc.bold('[Error] An error was thrown:')), 'error', category)
  }
  logDirectly(err, 'error')
}

function getConfigCategory(): LogCategory {
  const category = getCategory() ?? 'config'
  return category
}

function handleAssertMsg(err: unknown, category: LogCategory | null): boolean {
  const res = getAssertErrMsg(err)
  if (!res) return false
  const { assertMsg, showVikeVersion } = res
  logWithVikePrefix(assertMsg, 'error', category, showVikeVersion)
  return true
}
function assertLogger(thing: string | Error, logType: LogType): void {
  const category = getCategory()
  const res = getAssertErrMsg(thing)
  /* Risk of infinite loop
  assert(res)
  */
  if (!res) throw new Error('Internal error, reach out to a maintainer')
  const { assertMsg, showVikeVersion } = res
  logWithVikePrefix(assertMsg, logType, category, showVikeVersion)
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

export function logErrorDebugNote() {
  if (isErrorDebug()) return
  const store = getHttpRequestAsyncStore()
  if (store) {
    if (store.errorDebugNoteAlreadyShown) return
    store.errorDebugNoteAlreadyShown = true
  }
  const msg = pc.dim(
    [
      '=======================================================================',
      "| Error isn't helpful? See https://vite-plugin-ssr.com/errors#verbose |",
      '======================================================================='
    ].join('\n')
  )
  logDirectly(msg, 'error')
}

function getCategory(httpRequestId: number | null = null): LogCategory | null {
  const store = getHttpRequestAsyncStore()
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
