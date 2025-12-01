// TO-DO/eventually:
// - New hook onLog(): https://github.com/vikejs/vike/issues/1438
// - Exact same logs between prod and dev, only difference is that some log objects have:
//   - `isDevLog: true`
//   - `willBeLogged: false` in production
//   - `showTimestamp: true`
// - Never clear screen (it's complex with little benefit)
// - Only show a one-liner init log (instead of Vite's multi-line log)

export { logVite }
export { logConfigInfo }
export { logErrorServerDev }
export { logErrorDebugNote }
export type { LogType }

import { isAbortError } from '../../../shared-server-client/route/abort.js'
import { getViteConfig } from '../../../server/runtime/globalContext.js'
import {
  assertPageContext_logRuntime,
  type PageContext_logRuntime,
  setLogRuntimeDev,
} from '../../../server/runtime/loggerRuntime.js'
import {
  addOnBeforeAssertErr,
  assert,
  assertIsNotProductionRuntime,
  formatHintLog,
  hasGreen,
  hasProp,
  hasRed,
  hasYellow,
  isDebugError,
  isObject,
  stripAnsi,
} from '../utils.js'
import { getHttpRequestAsyncStore } from './getHttpRequestAsyncStore.js'
import { isErrorWithCodeSnippet, getPrettyErrorWithCodeSnippet } from './loggerDev/errorWithCodeSnippet.js'
import {
  getConfigExecutionErrorIntroMsg,
  getConfigBuildErrorFormatted,
} from './resolveVikeConfigInternal/transpileAndExecuteFile.js'
import pc from '@brillout/picocolors'
import { isUserHookError } from '../../../shared-server-client/hooks/execHook.js'
import { getViteDevServer } from '../../../server/runtime/globalContext.js'
import { logErrorServer } from '../../../server/runtime/logErrorServer.js'
import { getBetterError } from '../../../utils/getBetterError.js'

assertIsNotProductionRuntime()
setLogRuntimeDev(logErrorServerDev, logRuntimeInfoDev)
addOnBeforeAssertErr((err) => {
  // We must directly apply vite.ssrFixStacktrace() to `assertWarning(..., { showStackTrace: true })` because warnings aren't caught by the try-catch of renderPageServer()
  applyViteSourceMapToStackTrace(err)
})

type LogType = 'info' | 'warn' | 'error' | 'error-resolve'
// TODO: rename
type LogCategory = 'config' | `request(${number})`

function logRuntimeInfoDev(msg: string, pageContext: PageContext_logRuntime, logType: LogType) {
  assertPageContext_logRuntime(pageContext)
  const httpRequestId = pageContext === 'NULL_TEMP' ? null : pageContext._httpRequestId
  const category = getCategory(httpRequestId)
  logDirectly(msg, logType, category, '[vike]')
}
function logConfigInfo(msg: string, logType: LogType): void {
  const category = getCategory() ?? 'config'
  logDirectly(msg, logType, category, '[vike]')
}
function logVite(msg: string, logType: LogType, httpRequestId: number | null, prependViteTag: boolean): void {
  const category = getCategory(httpRequestId)
  logDirectly(msg, logType, category, '[vite]', !prependViteTag)
}

function logErrorServerDev(err: unknown, pageContext: PageContext_logRuntime, errorComesFromVite = false): void {
  assertPageContext_logRuntime(pageContext)
  applyViteSourceMapToStackTrace(err)

  const logErr = (err: unknown) => {
    logErrorServer(err, pageContext)
  }

  // Skip `throw render()` / `throw redirect()`
  if (isAbortError(err) && !isDebugError()) {
    return
  }

  // TODO: remove
  // Dedupe
  {
    const store = getHttpRequestAsyncStore()
    if (getHttpRequestAsyncStore()?.shouldErrorBeSwallowed(err)) {
      if (!isDebugError()) return
    } else {
      store?.markErrorAsLogged(err)
    }
  }

  const httpRequestId = pageContext === 'NULL_TEMP' ? null : pageContext._httpRequestId
  const category = getCategory(httpRequestId)

  if (isErrorWithCodeSnippet(err)) {
    // We handle transpile errors globally because wrapping viteDevServer.ssrLoadModule() wouldn't be enough: transpile errors can be thrown not only when calling viteDevServer.ssrLoadModule() but also later when loading user code with import() (since Vite lazy-transpiles import() calls)
    const viteConfig = getViteConfig()
    assert(viteConfig)
    let message = getPrettyErrorWithCodeSnippet(err, viteConfig.root)
    assert(stripAnsi(message).startsWith('Failed to transpile'))
    message = prependTags(message, '[vite]', category, 'error')
    message = appendErrorDebugNote(message)
    const errBetter = getBetterError(err, { message, hideStack: true })
    logErr(errBetter)
    return
  }

  {
    const errMsgFormatted = getConfigBuildErrorFormatted(err)
    if (errMsgFormatted) {
      assert(stripAnsi(errMsgFormatted).startsWith('Failed to transpile'))
      let message = errMsgFormatted
      message = prependTags(message, '[vike]', category, 'error')
      const errBetter = getBetterError(err, { message, hideStack: true })
      logErr(errBetter)
      return
    }
  }

  {
    const errIntro = getConfigExecutionErrorIntroMsg(err)
    if (errIntro) {
      assert(stripAnsi(errIntro).startsWith('Failed to execute'))
      let message = getErrMsgWithIntro(err, errIntro)
      message = prependTags(message, '[vike]', category, 'error')
      const errBetter = getBetterError(err, { message })
      logErr(errBetter)
      return
    }
  }

  {
    const hook = isUserHookError(err)
    if (hook) {
      const { hookName, hookFilePath } = hook
      const errIntro = pc.red(`Following error was thrown by the ${hookName}() hook defined at ${hookFilePath}`)
      let message = getErrMsgWithIntro(err, errIntro)
      message = prependTags(message, '[vike]', category, 'error')
      const errBetter = getBetterError(err, { message })
      logErr(errBetter)
      return
    }
  }

  if (category) {
    const errIntro = pc.bold(pc.red(`[Error] ${errorComesFromVite ? 'Transpilation error' : 'An error was thrown'}:`))
    let message = getErrMsgWithIntro(err, errIntro)
    message = prependTags(message, '[vike]', category, 'error')
    const errBetter = getBetterError(err, { message })
    logErr(errBetter)
    return
  }

  logErr(err)
}

// Note shown to user when Vike modifies errors in a risky fashion.
const errorDebugNote = pc.dim(formatHintLog("Error isn't helpful? See https://vike.dev/debug#verbose-errors"))
// TODO: remove
function logErrorDebugNote() {
  /*
  if (isDebugError()) return
  const store = getHttpRequestAsyncStore()
  if (store) {
    if (store.errorDebugNoteAlreadyShown) return
    store.errorDebugNoteAlreadyShown = true
  }
  logDirectly(errorDebugNote, 'error')
  */
}
function appendErrorDebugNote(errMsg: string) {
  return errMsg + '\n' + errorDebugNote
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

function logDirectly(
  msg: string,
  logType: LogType,
  category: LogCategory | null,
  projectTag: '[vike]' | '[vite]',
  doNotPrependTags?: boolean,
) {
  if (!doNotPrependTags) msg = prependTags(msg, projectTag, category, logType)

  if (logType === 'info') {
    console.log(msg)
    return
  }
  if (logType === 'warn') {
    console.warn(msg)
    return
  }
  if (logType === 'error') {
    console.error(msg)
    return
  }
  if (logType === 'error-resolve') {
    // stderr because user will most likely want to know about error recovering
    console.error(msg)
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

function prependTags(msg: string, projectTag: '[vite]' | '[vike]', category: LogCategory | null, logType: LogType) {
  const color = (s: string) => {
    if (logType === 'error' && !hasRed(msg)) return pc.bold(pc.red(s))
    if (logType === 'error-resolve' && !hasGreen(msg)) return pc.bold(pc.green(s))
    if (logType === 'warn' && !hasYellow(msg)) return pc.yellow(s)
    if (projectTag === '[vite]') return pc.bold(pc.cyan(s))
    if (projectTag === '[vike]') return pc.bold(pc.cyan(s))
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

function getErrMsgWithIntro(err: unknown, errIntro: string) {
  const errMsg = !isObject(err) ? '' : String(err.message || '')
  return errIntro + '\n' + errMsg
}
