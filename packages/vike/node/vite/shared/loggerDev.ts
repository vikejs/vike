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
  setAssertOnBeforeErr,
  assert,
  assertIsNotProductionRuntime,
  colorVike,
  colorVite,
  formatHintLog,
  hasGreen,
  hasProp,
  hasRed,
  hasYellow,
  isDebugError,
  stripAnsi,
  colorError,
  colorWarning,
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
import { getRequestId_withAsyncHook } from '../../../server/runtime/asyncHook.js'

assertIsNotProductionRuntime()
setLogRuntimeDev(logErrorServerDev, logRuntimeInfoDev)
setAssertOnBeforeErr((err) => {
  // We must directly apply vite.ssrFixStacktrace() to `assertWarning(..., { showStackTrace: true })` because warnings aren't caught by the try-catch of renderPageServer()
  applyViteSourceMap(err)
})
// Note shown to user when Vike completely modifies the error message (which is somewhat risky)
const errorDebugNote = pc.dim(formatHintLog("Error isn't helpful? See https://vike.dev/debug#verbose-errors"))

type LogType = 'info' | 'warn' | 'error' | 'error-resolve'
type TagTool = '[vike]' | '[vite]'
type TagSource = 'config' | `request-${number}`

function logRuntimeInfoDev(msg: string, pageContext: PageContext_logRuntime, logType: LogType) {
  assertPageContext_logRuntime(pageContext)
  const tagSource = addTagSource(pageContext?._requestId)
  logDev(msg, logType, tagSource, '[vike]')
}
function logConfigInfo(msg: string, logType: LogType): void {
  const tagSource = addTagSource() ?? 'config'
  logDev(msg, logType, tagSource, '[vike]')
}
function logVite(msg: string, logType: LogType, requestId: number | null, prependViteTag: boolean): void {
  const tagSource = addTagSource(requestId)
  logDev(msg, logType, tagSource, '[vite]', !prependViteTag)
}

function logErrorServerDev(err: unknown, pageContext: PageContext_logRuntime, errorComesFromVite = false): void {
  assertPageContext_logRuntime(pageContext)

  applyViteSourceMap(err)

  // Skip `throw render()` / `throw redirect()`
  if (isAbortError(err) && !isDebugError()) {
    return
  }

  const tagSource = addTagSource(pageContext?._requestId)
  const logErr = (err: unknown) => {
    logErrorServer(err, pageContext)
  }

  if (isErrorWithCodeSnippet(err)) {
    // We handle transpile errors globally because wrapping viteDevServer.ssrLoadModule() wouldn't be enough: transpile errors can be thrown not only when calling viteDevServer.ssrLoadModule() but also later when loading user code with import() (since Vite lazy-transpiles import() calls)
    const viteConfig = getViteConfig()
    assert(viteConfig)
    const errMsgFormatted = getPrettyErrorWithCodeSnippet(err, viteConfig.root)
    assert(stripAnsi(errMsgFormatted).startsWith('Failed to transpile'))
    const message =
      `${addTags(errMsgFormatted, '[vite]', tagSource, 'error')}${errMsgFormatted}\n${errorDebugNote}` as const
    const errBetter = getBetterError(err, { message, hideStack: true })
    logErr(errBetter)
    return
  }

  {
    const errMsgFormatted = getConfigBuildErrorFormatted(err)
    if (errMsgFormatted) {
      assert(stripAnsi(errMsgFormatted).startsWith('Failed to transpile'))
      const message = `${addTagsError(errMsgFormatted, tagSource)}${errMsgFormatted}\n${errorDebugNote}` as const
      const errBetter = getBetterError(err, { message, hideStack: true })
      logErr(errBetter)
      return
    }
  }

  {
    const errIntro = getConfigExecutionErrorIntroMsg(err)
    if (errIntro) {
      assert(stripAnsi(errIntro).startsWith('Failed to execute'))
      const prepend = `${addTagsError(errIntro, tagSource)}${errIntro}\n` as const
      const errBetter = getBetterError(err, { message: { prepend } })
      logErr(errBetter)
      return
    }
  }

  {
    const hook = isUserHookError(err)
    if (hook) {
      const { hookName, hookFilePath } = hook
      const errIntro = pc.red(
        `Following error was thrown by the ${hookName as string}() hook defined at ${hookFilePath}`,
      )
      const prepend = `${addTagsError(errIntro, tagSource)}${errIntro}\n` as const
      const errBetter = getBetterError(err, { message: { prepend } })
      logErr(errBetter)
      return
    }
  }

  if (tagSource) {
    const errIntro = colorError(`[Error] ${errorComesFromVite ? 'Transpilation error' : 'An error was thrown'}:`)
    const prepend = `${addTagsError(errIntro, tagSource)}${errIntro}\n` as const
    const errBetter = getBetterError(err, { message: { prepend } })
    logErr(errBetter)
    return
  }

  logErr(err)
}

function logDev(msg: string, logType: LogType, tagSource: TagSource | null, tagTool: TagTool, doNotAddTags?: boolean) {
  if (!doNotAddTags) {
    msg = addTags(msg, tagTool, tagSource, logType) + msg
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

function addTagSource(requestId: number | null = null): TagSource | null {
  const requestIdFromStore = getRequestId_withAsyncHook()
  if (requestIdFromStore !== null) {
    if (requestId === null) {
      requestId = requestIdFromStore
    } else {
      assert(requestId === requestIdFromStore)
    }
  }
  if (requestId === null) return null
  // const tagSource = requestId % 2 === 1 ? (`request-${requestId}` as const) : (`request(${requestId})` as const)
  const tagSource = `request-${requestId}` as const
  return tagSource
}

function applyViteSourceMap(thing: unknown) {
  if (isDebugError()) return
  if (!hasProp(thing, 'stack')) return
  const viteDevServer = getViteDevServer()
  if (!viteDevServer) return
  // Apply Vite's source maps
  viteDevServer.ssrFixStacktrace(thing as Error)
}

function addTagsError(msg: string, tagSource: TagSource | null) {
  return addTags(msg, '[vike]', tagSource, 'error')
}
function addTags<TTagTool extends TagTool>(
  msg: string,
  tagTool: TTagTool,
  tagSource: TagSource | null,
  logType: LogType,
) {
  const tagToolColored = (() => {
    if (logType === 'error' && !hasRed(msg)) return colorError(tagTool)
    if (logType === 'error-resolve' && !hasGreen(msg)) return pc.bold(pc.green(tagTool))
    if (logType === 'warn' && !hasYellow(msg)) return colorWarning(tagTool)
    if (tagTool === '[vite]') return colorVite(tagTool)
    if (tagTool === '[vike]') return colorVike(tagTool)
    assert(false)
  })()
  const timestamp = pc.dim(new Date().toLocaleTimeString() as '1:37:00 PM')
  const whitespace = (/\s|\[/.test(stripAnsi(msg)[0]!) ? '' : ' ') as ' '
  const tagSourceStr = (!tagSource ? '' : pc.dim(`[${tagSource}]`)) as '[request(n)]'
  const tags = `${timestamp} ${tagToolColored}${tagSourceStr}${whitespace}` as const
  return tags
}
