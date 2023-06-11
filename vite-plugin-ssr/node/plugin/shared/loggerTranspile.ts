export { logInfoTranspile }
export { logErrorTranspile }
export { logVite }
export { clearScreenWithVite }
export { addErrorIntroMsg }
export { isErrorWithCodeSnippet }
export type { LogInfoArgs }

import pc from '@brillout/picocolors'
import type { ResolvedConfig } from 'vite'
import { isRenderErrorPageException } from '../../../shared/route/RenderErrorPage'
import { getGlobalContext, getViteConfig } from '../../runtime/globalContext'
import { LogErrorArgs, logError_set, logInfo_set } from '../../runtime/renderPage/loggerRuntime'
import { isFirstViteLog } from './loggerVite'
import {
  assert,
  assertIsVitePluginCode,
  hasProp,
  isObject,
  isUserHookError,
  projectInfo,
  warnIfObjectIsNotObject
} from '../utils'
import { getAsyncHookStore } from './asyncHook'
import { isErrorDebug } from './isErrorDebug'
import { isFrameError, formatFrameError } from './loggerTranspile/formatFrameError'
import { getEsbuildFormattedError, isEsbuildFormattedError } from './loggerTranspile/formatEsbuildError'

assertIsVitePluginCode()
logInfo_set(logInfoTranspile)
logError_set(logErrorTranspile)

type LogCategory = 'config' | `request(${number})` | null
type LogType = 'info' | 'warn' | 'error' | 'error-recover'
type LogInfoArgs = Parameters<typeof logInfoTranspile>
const introMsgs = new WeakMap<object, LogInfoArgs>()
let screenHasErrors = false

function logInfoTranspile(
  msg: string,
  category: LogCategory,
  logType: LogType,
  options: { clearErrors?: boolean; clearIfFirstLog?: boolean } = {}
) {
  msg = addPrefix(msg, projectInfo.projectName, category, logType)

  const viteConfig = getViteConfig()
  assert(viteConfig)

  const clear = (options.clearErrors && screenHasErrors) || (options.clearIfFirstLog && isFirstViteLog)
  if (clear) {
    clearScreenWithVite(viteConfig)
  }

  logMsg(msg, logType)
}
function logMsg(msg: string, logType: LogType) {
  if (logType === 'info') {
    console.log(msg)
  } else if (logType === 'warn') {
    console.warn(msg)
  } else if (logType === 'error' || logType === 'error-recover') {
    console.error(msg)
  } else {
    assert(false)
  }
}
function clearScreenWithVite(viteConfig: ResolvedConfig) {
  screenHasErrors = false
  // We use Vite's logger in order to respect the user's `clearScreen: false` setting
  viteConfig.logger.clearScreen('error')
}

function logErrorTranspile(
  ...[err, { httpRequestId }, category = null]: LogErrorArgs | [...LogErrorArgs, LogCategory]
): boolean {
  if (isRenderErrorPageException(err)) {
    return false
  }
  const store = getAsyncHookStore()
  if (store?.loggedErrors.has(err)) {
    return false
  }

  if (store?.httpRequestId) {
    if (httpRequestId === null) {
      httpRequestId = store?.httpRequestId
    } else {
      assert(httpRequestId === store.httpRequestId)
    }
  }

  screenHasErrors = true
  logErr(err, { httpRequestId }, category)
  store?.loggedErrors.add(err)
  return true
}
function logErr(...[err, { httpRequestId }, category = null]: LogErrorArgs | [...LogErrorArgs, LogCategory]): void {
  warnIfObjectIsNotObject(err)

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

  if (isErrorDebug()) {
    logErrorIntro(err, httpRequestId, category)
    console.error(err)
    return
  }

  const errWithCodeSnippet = getErrorWithCodeSnippet(err, httpRequestId, category)
  if (errWithCodeSnippet) {
    // logErrorIntro()/addPrefix() already called
    console.error(errWithCodeSnippet)
    return
  }

  logErrorIntro(err, httpRequestId, category)
  console.error(err)
}
function logErrorIntro(err: unknown, httpRequestId: number | null, category: null | LogCategory) {
  if (!isObject(err)) return
  if (introMsgs.has(err)) {
    const logInfoArgs = introMsgs.get(err)!
    logInfoTranspile(...logInfoArgs)
    return
  }
  if (!category && httpRequestId) {
    category = getCategoryRequest(httpRequestId)
  }
  const hook = isUserHookError(err)
  if (hook) {
    const { hookName, hookFilePath } = hook
    logInfoTranspile(pc.red(`Error thrown by hook ${hookName}() (${hookFilePath}):`), category, 'error')
    return
  }
  if (httpRequestId !== null) {
    logInfoTranspile(pc.red('Error thrown:'), category, 'error')
    return
  }
}

function getErrorWithCodeSnippet(
  err: unknown,
  httpRequestId: number | null,
  category: null | LogCategory
): string | null {
  if (isFrameError(err)) {
    // We handle transpile errors globally because transpile errors can be thrown not only when calling viteDevServer.ssrLoadModule() but also later when calling user hooks (since Vite loads/transpiles user code in a lazy manner)
    const viteConfig = getViteConfig()
    assert(viteConfig)
    let errStr = formatFrameError(err, viteConfig.root)
    if (!category && httpRequestId) {
      category = getCategoryRequest(httpRequestId)
    }
    errStr = addPrefix(errStr, 'vite', category, 'error')
    return errStr
  }

  const errStr = getEsbuildFormattedError(err)
  if (errStr) {
    logErrorIntro(err, httpRequestId, category)
    return errStr
  }

  return null
}
function isErrorWithCodeSnippet(err: unknown): boolean {
  return isFrameError(err) || isEsbuildFormattedError(err)
}

function getCategoryRequest(httpRequestId: number) {
  return `request(${httpRequestId})` as const
}

function addErrorIntroMsg(err: unknown, ...logInfoArgs: LogInfoArgs) {
  assert(isObject(err))
  introMsgs.set(err, logInfoArgs)
}

function logVite(msg: string, logType: LogType, httpRequestId: number | null, withTag: boolean) {
  const category = httpRequestId ? getCategoryRequest(httpRequestId) : null
  if (withTag) {
    msg = addPrefix(msg, 'vite', category, logType)
  }
  logMsg(msg, logType)
}

function addPrefix(msg: string, project: 'vite' | 'vite-plugin-ssr', category: LogCategory, logType: LogType) {
  const color = (s: string) => {
    if (logType === 'error' && !hasRed(msg)) return pc.red(s)
    if (logType === 'error-recover' && !hasGreen(msg)) return pc.green(s)
    if (logType === 'warn' && !hasYellow(msg)) return pc.yellow(s)
    if (project === 'vite-plugin-ssr') return pc.yellow(s)
    if (project === 'vite') return pc.cyan(s)
    assert(false)
  }
  let tag = color(pc.bold(`[${project}]`))
  if (category) {
    tag = tag + pc.dim(`[${category}]`)
  }

  const timestamp = pc.dim(new Date().toLocaleTimeString())

  return `${timestamp} ${tag} ${msg}`
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
  return str.includes('\x1b[31m')
}
