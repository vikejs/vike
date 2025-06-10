// Non-production logger used for:
//  - Development
//  - Preview
//  - Build
//  - Pre-rendering
// In other words: everywhere except in production

export { logViteAny }
export { logViteError }
export { logConfigInfo }
export { logConfigError }
export { logConfigErrorRecover }
export { logErrorDebugNote }
export type { LogInfo }
export type { LogInfoArgs }
export type { LogError }
export type { LogErrorArgs }
export type { LogType }
export type { LogCategory }

import { isAbortError } from '../../../shared/route/abort.js'
import { getViteConfig, vikeConfigErrorRecoverMsg } from '../../runtime/globalContext.js'
import { overwriteRuntimeProductionLogger } from '../../runtime/loggerRuntime.js'
import {
  assert,
  assertIsNotProductionRuntime,
  formatHintLog,
  getAssertErrMsg,
  overwriteAssertProductionLogger,
  stripAnsi,
  warnIfErrorIsNotObject
} from '../utils.js'
import { getHttpRequestAsyncStore } from './getHttpRequestAsyncStore.js'
import { isErrorDebug } from '../../shared/isErrorDebug.js'
import { isErrorWithCodeSnippet, getPrettyErrorWithCodeSnippet } from './loggerNotProd/errorWithCodeSnippet.js'
import {
  getConfigExecutionErrorIntroMsg,
  getConfigBuildErrorFormatted
} from './resolveVikeConfigInternal/transpileAndExecuteFile.js'
import { logWithVikeTag, logWithViteTag, logDirectly, applyViteSourceMapToStackTrace } from './loggerNotProd/log.js'
import pc from '@brillout/picocolors'
import { setAlreadyLogged } from '../../runtime/renderPage/isNewError.js'
import { onRuntimeError } from '../../runtime/renderPage/loggerProd.js'
import { isUserHookError } from '../../../shared/hooks/execHook.js'

assertIsNotProductionRuntime()
overwriteRuntimeProductionLogger(logRuntimeError, logRuntimeInfo)
overwriteAssertProductionLogger(assertLogger)

type LogType = 'info' | 'warn' | 'error' | 'error-recover'
type LogCategory = 'config' | `request(${number})`
type LogInfo = (...args: LogInfoArgs) => void
type LogInfoArgs = Parameters<typeof logRuntimeInfo>
type LogError = (...args: LogErrorArgs) => void
type LogErrorArgs = Parameters<typeof logRuntimeError>

function logRuntimeInfo(msg: string, httpRequestId: number | null, logType: LogType) {
  const category = getCategory(httpRequestId)
  logWithVikeTag(msg, logType, category)
}
function logViteAny(msg: string, logType: LogType, httpRequestId: number | null, prependViteTag: boolean): void {
  if (prependViteTag) {
    const category = getCategory(httpRequestId)
    logWithViteTag(msg, logType, category)
  } else {
    logDirectly(msg, logType)
  }
}
function logConfigInfo(msg: string, logType: LogType): void {
  const category = getConfigCategory()
  logWithVikeTag(msg, logType, category)
}
function logConfigErrorRecover(): void {
  const category = getConfigCategory()
  logWithVikeTag(vikeConfigErrorRecoverMsg, 'error-recover', category)
}

function logRuntimeError(
  err: unknown,
  // httpRequestId is `null` when pre-rendering
  httpRequestId: number | null
): void {
  logErr(err, httpRequestId, false)
}
function logViteError(
  err: unknown,
  // httpRequestId is `undefined` if development environment doesn't support async stores
  httpRequestId: number | undefined
): void {
  logErr(err, httpRequestId, true)
}
function logErr(err: unknown, httpRequestId: number | null = null, errorComesFromVite: boolean): void {
  warnIfErrorIsNotObject(err)

  if (isAbortError(err) && !isErrorDebug()) {
    return
  }

  const store = getHttpRequestAsyncStore()

  setAlreadyLogged(err)
  if (getHttpRequestAsyncStore()?.shouldErrorBeSwallowed(err)) {
    if (!isErrorDebug()) return
  } else {
    store?.markErrorAsLogged(err)
  }

  const category = getCategory(httpRequestId)

  if (!isErrorDebug()) {
    if (isErrorWithCodeSnippet(err)) {
      // We handle transpile errors globally because wrapping viteDevServer.ssrLoadModule() wouldn't be enough: transpile errors can be thrown not only when calling viteDevServer.ssrLoadModule() but also later when loading user code with import() (since Vite lazy-transpiles import() calls)
      const viteConfig = getViteConfig()
      assert(viteConfig)
      const prettyErr = getPrettyErrorWithCodeSnippet(err, viteConfig.root)
      assert(stripAnsi(prettyErr).startsWith('Failed to transpile'))
      logWithViteTag(prettyErr, 'error', category)
      logErrorDebugNote()
      return
    }

    {
      const logged = handleAssertMsg(err, category)
      if (logged) return
    }
  }

  // Needs to be after assertion messages handling, because user hooks may throw an assertion error
  const hook = isUserHookError(err)
  if (hook) {
    const { hookName, hookFilePath } = hook
    logWithVikeTag(
      pc.red(`Following error was thrown by the ${hookName}() hook defined at ${hookFilePath}`),
      'error',
      category
    )
  } else if (category) {
    logFallbackErrIntro(category, errorComesFromVite)
  }

  logDirectly(err, 'error')

  // Needs to be called after logging the error.
  onRuntimeError(err)
}

function logConfigError(err: unknown): void {
  warnIfErrorIsNotObject(err)

  const category = getConfigCategory()

  {
    const errIntroMsg = getConfigExecutionErrorIntroMsg(err)
    if (errIntroMsg) {
      assert(stripAnsi(errIntroMsg).startsWith('Failed to execute'))
      logWithVikeTag(errIntroMsg, 'error', category)
      logDirectly(err, 'error')
      return
    }
  }
  {
    const errMsgFormatted = getConfigBuildErrorFormatted(err)
    if (errMsgFormatted) {
      assert(stripAnsi(errMsgFormatted).startsWith('Failed to transpile'))
      if (!isErrorDebug()) {
        logWithVikeTag(errMsgFormatted, 'error', category)
      } else {
        logDirectly(err, 'error')
      }
      return
    }
  }
  {
    const logged = handleAssertMsg(err, category)
    if (logged) return
  }

  if (category) logFallbackErrIntro(category, false)
  logDirectly(err, 'error')
}

function logFallbackErrIntro(category: LogCategory, errorComesFromVite: boolean) {
  const msg = errorComesFromVite ? 'Transpilation error' : 'An error was thrown'
  logWithVikeTag(pc.bold(pc.red(`[Error] ${msg}:`)), 'error', category)
}

function getConfigCategory(): LogCategory {
  const category = getCategory() ?? 'config'
  return category
}

function handleAssertMsg(err: unknown, category: LogCategory | null): boolean {
  const res = getAssertErrMsg(err)
  if (!res) return false
  const { assertMsg, showVikeVersion } = res
  logWithVikeTag(assertMsg, 'error', category, showVikeVersion)
  return true
}
function assertLogger(thing: string | Error, logType: LogType): void {
  // vite.ssrFixStacktrace() is needed for `assertWarning(..., { showStackTrace: true })`
  applyViteSourceMapToStackTrace(thing)
  const category = getCategory()
  const res = getAssertErrMsg(thing)
  /* Risk of infinite loop
  assert(res)
  */
  if (!res) throw new Error('Internal Vike error, reach out to a maintainer')
  const { assertMsg, showVikeVersion } = res
  logWithVikeTag(assertMsg, logType, category, showVikeVersion)
}

/** Note shown to user when vike does something risky:
 *  - When vike dedupes (i.e. swallows) an error with getHttpRequestAsyncStore().shouldErrorBeSwallowed(err)
 *  - When vike modifies the error with getPrettyErrorWithCodeSnippet(err)
 */
function logErrorDebugNote() {
  if (isErrorDebug()) return
  const store = getHttpRequestAsyncStore()
  if (store) {
    if (store.errorDebugNoteAlreadyShown) return
    store.errorDebugNoteAlreadyShown = true
  }
  const msg = pc.dim(formatHintLog("Error isn't helpful? See https://vike.dev/debug#verbose-errors"))
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
  if (httpRequestId === null) return null
  // const category = httpRequestId % 2 === 1 ? (`request-${httpRequestId}` as const) : (`request(${httpRequestId})` as const)
  const category = `request(${httpRequestId})` as const
  return category
}
