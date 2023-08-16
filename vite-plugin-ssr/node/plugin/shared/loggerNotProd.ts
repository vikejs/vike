// Non-production logger used for:
//  - Development
//  - Preview
//  - Build
//  - Pre-rendering
// In other words: everywhere except in production

export { logViteAny }
export { logViteErrorContainingCodeSnippet }
export { logConfigInfo }
export { logConfigError }
export { logConfigErrorRecover }
export { logErrorDebugNote }
export { clearLogs }
export type { LogInfo }
export type { LogInfoArgs }
export type { LogError }
export type { LogErrorArgs }
export type { LogType }
export type { LogCategory }

import { isAbortError } from '../../../shared/route/abort.js'
import { getViteConfig } from '../../runtime/globalContext.js'
import { overwriteRuntimeProductionLogger } from '../../runtime/renderPage/loggerRuntime.js'
import {
  assert,
  assertIsNotProductionRuntime,
  getAssertErrMsg,
  isUserHookError,
  overwriteAssertProductionLogger,
  stripAnsi,
  warnIfObjectIsNotObject
} from '../utils.js'
import { getHttpRequestAsyncStore } from './getHttpRequestAsyncStore.js'
import { isErrorDebug } from './isErrorDebug.js'
import {
  isErrorWithCodeSnippet,
  getPrettyErrorWithCodeSnippet,
  type ErrorWithCodeSnippet
} from './loggerNotProd/errorWithCodeSnippet.js'
import {
  getConfigExececutionErrorIntroMsg,
  getConfigBuildErrorFormatted
} from '../plugins/importUserCode/v1-design/transpileAndExecuteFile.js'
import {
  logWithVikeTag,
  logWithViteTag,
  logDirectly,
  isFirstLog,
  screenHasErrors,
  clearScreen
} from './loggerNotProd/log.js'
import pc from '@brillout/picocolors'
import { setAlreadyLogged } from '../../runtime/renderPage/isNewError.js'
import { isConfigInvalid } from '../../runtime/renderPage/isConfigInvalid.js'

assertIsNotProductionRuntime()
overwriteRuntimeProductionLogger(logRuntimeError, logRuntimeInfo)
overwriteAssertProductionLogger(assertLogger)

type LogType = 'info' | 'warn' | 'error' | 'error-recover'
type LogCategory = 'config' | `request(${number})`
type LogInfo = (...args: LogInfoArgs) => void
type LogInfoArgs = Parameters<typeof logRuntimeInfo>
type LogError = (...args: LogErrorArgs) => void
type LogErrorArgs = Parameters<typeof logRuntimeError>

function logRuntimeInfo(msg: string, httpRequestId: number, logType: LogType, clearErrors?: boolean) {
  if (clearErrors) clearLogs({ clearErrors: true })
  const category = getCategory(httpRequestId)
  assert(category)
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
  const msg = pc.green(pc.bold('Configuration successfully loaded.'))
  clearLogs({ clearAlsoIfConfigIsInvalid: true })
  const category = getConfigCategory()
  logWithVikeTag(msg, 'error-recover', category)
}

function logRuntimeError(
  err: unknown,
  /** `httpRequestId` is `null` when pre-rendering */
  httpRequestId: number | null
): void {
  logErr(err, httpRequestId)
}
function logViteErrorContainingCodeSnippet(err: ErrorWithCodeSnippet): void {
  logErr(err)
}
function logErr(err: unknown, httpRequestId: number | null = null): void {
  warnIfObjectIsNotObject(err)

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
      let prettyErr = getPrettyErrorWithCodeSnippet(err, viteConfig.root)
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
    logFallbackErrIntro(category)
  }
  logDirectly(err, 'error')
}

function logConfigError(err: unknown): void {
  clearLogs({ clearAlsoIfConfigIsInvalid: true })

  warnIfObjectIsNotObject(err)

  const category = getConfigCategory()

  {
    const errIntroMsg = getConfigExececutionErrorIntroMsg(err)
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

  if (category) logFallbackErrIntro(category)
  logDirectly(err, 'error')
}

function logFallbackErrIntro(category: LogCategory) {
  logWithVikeTag(pc.red(pc.bold('[Error] An error was thrown:')), 'error', category)
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
  const category = getCategory()
  const res = getAssertErrMsg(thing)
  /* Risk of infinite loop
  assert(res)
  */
  if (!res) throw new Error('Internal error, reach out to a maintainer')
  const { assertMsg, showVikeVersion } = res
  logWithVikeTag(assertMsg, logType, category, showVikeVersion)
}

function clearLogs(
  conditions: { clearErrors?: boolean; clearIfFirstLog?: boolean; clearAlsoIfConfigIsInvalid?: boolean } = {}
): void {
  if (!conditions.clearAlsoIfConfigIsInvalid && isConfigInvalid) {
    // Avoid hiding the config error: the config error is printed only once
    return
  }
  if (conditions.clearErrors && !screenHasErrors) {
    return
  }
  if (conditions.clearIfFirstLog && !isFirstLog) {
    return
  }
  const viteConfig = getViteConfig()
  if (viteConfig) {
    clearScreen(viteConfig)
  }
}

/** Note shown to user when vite-plugin-ssr does something risky:
 *  - When vite-plugin-ssr dedupes (i.e. swallows) an error with getHttpRequestAsyncStore().shouldErrorBeSwallowed(err)
 *  - When vite-plugin-ssr modifies the error with getPrettyErrorWithCodeSnippet(err)
 */
function logErrorDebugNote() {
  if (isErrorDebug()) return
  const store = getHttpRequestAsyncStore()
  if (store) {
    if (store.errorDebugNoteAlreadyShown) return
    store.errorDebugNoteAlreadyShown = true
  }
  const msg = pc.dim(
    [
      '┌─────────────────────────────────────────────────────────────────────┐',
      "│ Error isn't helpful? See https://vite-plugin-ssr.com/errors#verbose │",
      '└─────────────────────────────────────────────────────────────────────┘'
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
  if (httpRequestId === null) return null
  // const category = httpRequestId % 2 === 1 ? (`request-${httpRequestId}` as const) : (`request(${httpRequestId})` as const)
  const category = `request(${httpRequestId})` as const
  return category
}
