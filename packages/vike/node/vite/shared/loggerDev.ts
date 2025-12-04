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
  stripAnsi,
} from '../utils.js'
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
import { getHttpRequestId_withAsyncHook } from '../../../server/runtime/asyncHook.js'

assertIsNotProductionRuntime()
setLogRuntimeDev(logErrorServerDev, logRuntimeInfoDev)
addOnBeforeAssertErr((err) => {
  // We must directly apply vite.ssrFixStacktrace() to `assertWarning(..., { showStackTrace: true })` because warnings aren't caught by the try-catch of renderPageServer()
  applyViteSourceMapToStackTrace(err)
})

type LogType = 'info' | 'warn' | 'error' | 'error-resolve'
type TagTool = '[vike]' | '[vite]'
type TagSource = 'config' | `request(${number})`

function logRuntimeInfoDev(msg: string, pageContext: PageContext_logRuntime, logType: LogType) {
  assertPageContext_logRuntime(pageContext)
  const requestId = pageContext === null ? null : pageContext._requestId
  const tagSource = getTagSource(requestId)
  logDev(msg, logType, tagSource, '[vike]')
}
function logConfigInfo(msg: string, logType: LogType): void {
  const tagSource = getTagSource() ?? 'config'
  logDev(msg, logType, tagSource, '[vike]')
}
function logVite(msg: string, logType: LogType, requestId: number | null, prependViteTag: boolean): void {
  const tagSource = getTagSource(requestId)
  logDev(msg, logType, tagSource, '[vite]', !prependViteTag)
}

function logErrorServerDev(err: unknown, pageContext: PageContext_logRuntime, errorComesFromVite = false): void {
  assertPageContext_logRuntime(pageContext)

  applyViteSourceMapToStackTrace(err)

  // Skip `throw render()` / `throw redirect()`
  if (isAbortError(err) && !isDebugError()) {
    return
  }

  const requestId = pageContext === null ? null : pageContext._requestId
  const tagSource = getTagSource(requestId)
  const logErr = (err: unknown) => {
    logErrorServer(err, pageContext)
  }

  if (isErrorWithCodeSnippet(err)) {
    // We handle transpile errors globally because wrapping viteDevServer.ssrLoadModule() wouldn't be enough: transpile errors can be thrown not only when calling viteDevServer.ssrLoadModule() but also later when loading user code with import() (since Vite lazy-transpiles import() calls)
    const viteConfig = getViteConfig()
    assert(viteConfig)
    let message = getPrettyErrorWithCodeSnippet(err, viteConfig.root)
    assert(stripAnsi(message).startsWith('Failed to transpile'))
    message = prependTags(message, '[vite]', tagSource, 'error')
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
      message = prependTags(message, '[vike]', tagSource, 'error')
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
      message = prependTags(message, '[vike]', tagSource, 'error')
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
      message = prependTags(message, '[vike]', tagSource, 'error')
      const errBetter = getBetterError(err, { message })
      logErr(errBetter)
      return
    }
  }

  if (tagSource) {
    const errIntro = pc.bold(pc.red(`[Error] ${errorComesFromVite ? 'Transpilation error' : 'An error was thrown'}:`))
    let message = getErrMsgWithIntro(err, errIntro)
    message = prependTags(message, '[vike]', tagSource, 'error')
    const errBetter = getBetterError(err, { message })
    logErr(errBetter)
    return
  }

  logErr(err)
}

function logDev(
  msg: string,
  logType: LogType,
  tagSource: TagSource | null,
  tagTool: TagTool,
  doNotPrependTags?: boolean,
) {
  if (!doNotPrependTags) {
    msg = prependTags(msg, tagTool, tagSource, logType)
  }

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

// Note shown to user when Vike modifies errors in a risky fashion.
function appendErrorDebugNote(errMsg: string) {
  const errorDebugNote = pc.dim(formatHintLog("Error isn't helpful? See https://vike.dev/debug#verbose-errors"))
  return errMsg + '\n' + errorDebugNote
}

function getTagSource(requestId: number | null = null): TagSource | null {
  const requestIdFromStore = getHttpRequestId_withAsyncHook()
  if (requestIdFromStore !== null) {
    if (requestId === null) {
      requestId = requestIdFromStore
    } else {
      assert(requestId === requestIdFromStore)
    }
  }
  if (requestId === null) return null
  // const tagSource = requestId % 2 === 1 ? (`request-${requestId}` as const) : (`request(${requestId})` as const)
  const tagSource = `request(${requestId})` as const
  return tagSource
}

function applyViteSourceMapToStackTrace(thing: unknown) {
  if (isDebugError()) return
  if (!hasProp(thing, 'stack')) return
  const viteDevServer = getViteDevServer()
  if (!viteDevServer) return
  // Apply Vite's source maps
  viteDevServer.ssrFixStacktrace(thing as Error)
}

function prependTags(msg: string, tagTool: TagTool, tagSource: TagSource | null, logType: LogType) {
  const color = (s: string) => {
    if (logType === 'error' && !hasRed(msg)) return pc.bold(pc.red(s))
    if (logType === 'error-resolve' && !hasGreen(msg)) return pc.bold(pc.green(s))
    if (logType === 'warn' && !hasYellow(msg)) return pc.yellow(s)
    if (tagTool === '[vite]') return pc.bold(pc.cyan(s))
    if (tagTool === '[vike]') return pc.bold(pc.cyan(s))
    assert(false)
  }
  let tag = color(tagTool)
  if (tagSource) {
    tag = tag + pc.dim(`[${tagSource}]`)
  }

  const timestamp = pc.dim(new Date().toLocaleTimeString())

  const whitespace = /\s|\[/.test(stripAnsi(msg)[0]!) ? '' : ' '

  return `${timestamp} ${tag}${whitespace}${msg}`
}

function getErrMsgWithIntro(err: unknown, errIntro: string) {
  const errMsg = String((err as any)?.message || '')
  return errIntro + '\n' + errMsg
}
