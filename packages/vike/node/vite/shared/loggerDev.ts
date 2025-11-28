// TO-DO/eventually:
// - New hook onLog(): https://github.com/vikejs/vike/issues/1438
// - Exact same logs between prod and dev, only difference is that some log objects have:
//   - `isDevLog: true`
//   - `willBeLogged: false` in production
//   - `showTimestamp: true`
// - Never clear screen (it's complex with little benefit)
//   - Add shortcut to clear screen
//   - Maybe rotate colors upon no requests within 30s?
// - Only show a one-liner init log (instead of Vite's multi-line log)

// Non-production logger used for:
//  - Development
//  - Preview
//  - Build
//  - Pre-rendering
// In other words: everywhere except in production

export { logViteMsg }
export { logViteError }
export { logConfigInfo }
export { logConfigError }
export { logConfigErrorRecover }
export { logErrorDebugNote }
export type { LogType }

import { isAbortError } from '../../../shared-server-client/route/abort.js'
import { getViteConfig, vikeConfigErrorRecoverMsg } from '../../../server/runtime/globalContext.js'
import { setLogRuntimeDev } from '../../../server/runtime/loggerRuntime.js'
import {
  assert,
  assertIsNotProductionRuntime,
  formatHintLog,
  getAssertErrMsg,
  hasProp,
  isDebugError,
  overwriteAssertProductionLogger,
  PROJECT_VERSION,
  stripAnsi,
  warnIfErrorIsNotObject,
} from '../utils.js'
import { getHttpRequestAsyncStore } from './getHttpRequestAsyncStore.js'
import { isErrorWithCodeSnippet, getPrettyErrorWithCodeSnippet } from './loggerDev/errorWithCodeSnippet.js'
import {
  getConfigExecutionErrorIntroMsg,
  getConfigBuildErrorFormatted,
} from './resolveVikeConfigInternal/transpileAndExecuteFile.js'
import pc from '@brillout/picocolors'
import { setAlreadyLogged } from '../../../server/runtime/renderPageServer/isNewError.js'
import { onRuntimeError } from '../../../server/runtime/renderPageServer/loggerProd.js'
import { isUserHookError } from '../../../shared-server-client/hooks/execHook.js'
import { getViteDevServer } from '../../../server/runtime/globalContext.js'
import { logErrorServer } from '../../../server/runtime/logErrorServer.js'

assertIsNotProductionRuntime()
setLogRuntimeDev(logRuntimeErrorDev, logRuntimeInfoDev)
overwriteAssertProductionLogger(assertLogger)

type LogType = 'info' | 'warn' | 'error-thrown' | 'error-recover' | 'error-note'
type LogCategory = 'config' | `request(${number})`
type ProjectTag = `[vike]` | `[vike@${typeof PROJECT_VERSION}]`

function logRuntimeInfoDev(msg: string, httpRequestId: number | null, logType: LogType) {
  const category = getCategory(httpRequestId)
  logWithVikeTag(msg, logType, category)
}
function logViteMsg(msg: string, logType: LogType, httpRequestId: number | null, prependViteTag: boolean): void {
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

function logRuntimeErrorDev(
  err: unknown,
  // httpRequestId is `null` when pre-rendering
  httpRequestId: number | null,
): void {
  logErr(err, httpRequestId, false)
}
function logViteError(
  err: unknown,
  // httpRequestId is `undefined` if development environment doesn't support async stores
  httpRequestId: number | undefined,
): void {
  logErr(err, httpRequestId, true)
}
function logErr(err: unknown, httpRequestId: number | null = null, errorComesFromVite: boolean): void {
  warnIfErrorIsNotObject(err)

  if (isAbortError(err) && !isDebugError()) {
    return
  }

  const store = getHttpRequestAsyncStore()

  setAlreadyLogged(err)
  if (getHttpRequestAsyncStore()?.shouldErrorBeSwallowed(err)) {
    if (!isDebugError()) return
  } else {
    store?.markErrorAsLogged(err)
  }

  const category = getCategory(httpRequestId)

  if (!isDebugError()) {
    if (isErrorWithCodeSnippet(err)) {
      // We handle transpile errors globally because wrapping viteDevServer.ssrLoadModule() wouldn't be enough: transpile errors can be thrown not only when calling viteDevServer.ssrLoadModule() but also later when loading user code with import() (since Vite lazy-transpiles import() calls)
      const viteConfig = getViteConfig()
      assert(viteConfig)
      const prettyErr = getPrettyErrorWithCodeSnippet(err, viteConfig.root)
      assert(stripAnsi(prettyErr).startsWith('Failed to transpile'))
      logWithViteTag(prettyErr, 'error-thrown', category)
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
      'error-note',
      category,
    )
  } else if (category) {
    logFallbackErrIntro(category, errorComesFromVite)
  }

  logDirectly(err, 'error-thrown')

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
      logWithVikeTag(errIntroMsg, 'error-note', category)
      logDirectly(err, 'error-thrown')
      return
    }
  }
  {
    const errMsgFormatted = getConfigBuildErrorFormatted(err)
    if (errMsgFormatted) {
      assert(stripAnsi(errMsgFormatted).startsWith('Failed to transpile'))
      if (!isDebugError()) {
        logWithVikeTag(errMsgFormatted, 'error-thrown', category)
      } else {
        logDirectly(err, 'error-thrown')
      }
      return
    }
  }
  {
    const logged = handleAssertMsg(err, category)
    if (logged) return
  }

  if (category) logFallbackErrIntro(category, false)
  logDirectly(err, 'error-thrown')
}

function logFallbackErrIntro(category: LogCategory, errorComesFromVite: boolean) {
  const msg = errorComesFromVite ? 'Transpilation error' : 'An error was thrown'
  logWithVikeTag(pc.bold(pc.red(`[Error] ${msg}:`)), 'error-note', category)
}

function getConfigCategory(): LogCategory {
  const category = getCategory() ?? 'config'
  return category
}

function handleAssertMsg(err: unknown, category: LogCategory | null): boolean {
  const res = getAssertErrMsg(err)
  if (!res) return false
  const { assertMsg, showVikeVersion } = res
  logWithVikeTag(assertMsg, 'error-thrown', category, showVikeVersion)
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
  if (isDebugError()) return
  const store = getHttpRequestAsyncStore()
  if (store) {
    if (store.errorDebugNoteAlreadyShown) return
    store.errorDebugNoteAlreadyShown = true
  }
  const msg = pc.dim(formatHintLog("Error isn't helpful? See https://vike.dev/debug#verbose-errors"))
  logDirectly(msg, 'error-note')
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

function logWithVikeTag(msg: string, logType: LogType, category: LogCategory | null, showVikeVersion = false) {
  const projectTag = getProjectTag(showVikeVersion)
  msg = prependTags(msg, projectTag, category, logType)
  logDirectly(msg, logType)
}
function getProjectTag(showVikeVersion: boolean) {
  let projectTag: ProjectTag
  if (showVikeVersion) {
    projectTag = `[vike@${PROJECT_VERSION}]`
  } else {
    projectTag = `[vike]`
  }
  return projectTag
}
function logWithViteTag(msg: string, logType: LogType, category: LogCategory | null) {
  msg = prependTags(msg, '[vite]', category, logType)
  logDirectly(msg, logType)
}

// Not production => every log is triggered by logDirectly()
//  - Even all Vite logs also go through logDirectly() (see interceptors of loggerVite.ts)
//  - Production => logs aren't managed by loggerDev.ts => logDirectly() is never called (not even loaded as asserted by assertIsVitePluginCode())
function logDirectly(thing: unknown, logType: LogType) {
  applyViteSourceMapToStackTrace(thing)

  if (logType === 'info') {
    console.log(thing)
    return
  }
  if (logType === 'warn') {
    console.warn(thing)
    return
  }
  if (logType === 'error-note') {
    console.error(thing)
    return
  }
  if (logType === 'error-thrown') {
    // console.error()
    logErrorServer(thing)
    return
  }
  if (logType === 'error-recover') {
    // stderr because user will most likely want to know about error recovering
    console.error(thing)
    return
  }

  assert(false)
}

function applyViteSourceMapToStackTrace(thing: unknown) {
  if (isDebugError()) return
  if (!hasProp(thing, 'stack')) return
  const viteDevServer = getViteDevServer()
  if (!viteDevServer) return
  // Apply Vite's source maps
  viteDevServer.ssrFixStacktrace(thing as Error)
}

function prependTags(msg: string, projectTag: '[vite]' | ProjectTag, category: LogCategory | null, logType: LogType) {
  const color = (s: string) => {
    if (logType === 'error-thrown' && !hasRed(msg)) return pc.bold(pc.red(s))
    if (logType === 'error-recover' && !hasGreen(msg)) return pc.bold(pc.green(s))
    if (logType === 'warn' && !hasYellow(msg)) return pc.yellow(s)
    if (projectTag === '[vite]') return pc.bold(pc.cyan(s))
    if (projectTag.startsWith(`[vike`)) return pc.bold(pc.cyan(s))
    assert(false)
  }
  let tag = color(`${projectTag}`)
  if (category) {
    tag = tag + pc.dim(`[${category}]`)
  }

  const timestamp = pc.dim(new Date().toLocaleTimeString())

  const whitespace = /\s|\[/.test(stripAnsi(msg)[0]!) ? '' : ' '

  return `${timestamp} ${tag}${whitespace}${msg}`
}
function hasRed(str: string): boolean {
  // https://github.com/brillout/picocolors/blob/e291f2a3e3251a7f218ab6369ae94434d85d0eb0/picocolors.js#L57
  return str.includes('\x1b[31m')
}
function hasGreen(str: string): boolean {
  // https://github.com/brillout/picocolors/blob/e291f2a3e3251a7f218ab6369ae94434d85d0eb0/picocolors.js#L58
  return str.includes('\x1b[32m')
}
function hasYellow(str: string): boolean {
  // https://github.com/brillout/picocolors/blob/e291f2a3e3251a7f218ab6369ae94434d85d0eb0/picocolors.js#L59
  return str.includes('\x1b[33m')
}
