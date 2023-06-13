// Non-production logger used for:
//  - Development
//  - Preview
//  - Build
//  - Pre-rendering

export { logInfoNotProd }
export { logErrorNotProd }
export { logAsVite }
export { clearWithVite }
export { addErrorIntroMsg }
export { isErrorWithCodeSnippet }
export type { LogInfoArgs }
export type { LogInfo }

import pc from '@brillout/picocolors'
import type { ResolvedConfig } from 'vite'
import { isRenderErrorPageException } from '../../../shared/route/RenderErrorPage'
import { getGlobalContext, getViteConfig } from '../../runtime/globalContext'
import { setRuntimeLogger } from '../../runtime/renderPage/loggerRuntime'
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
import type { LogErrorArgs } from '../../runtime/renderPage/loggerProd'

assertIsVitePluginCode()
setRuntimeLogger(logErrorNotProd, logInfoNotProd)

type LogCategory = 'config' | `request(${number})` | null
type LogType = 'info' | 'warn' | 'error' | 'error-recover'
type LogInfoArgs = Parameters<typeof logInfoNotProd>
type LogInfo = (...args: LogInfoArgs) => void
const introMsgs = new WeakMap<object, LogInfoArgs>()
let screenHasErrors = false

function logInfoNotProd(
  msg: string,
  category: LogCategory,
  logType: LogType,
  options: { clearErrors?: boolean; clearIfFirstLog?: boolean } = {}
) {
  msg = addPrefix(msg, projectInfo.projectName, category, logType)

  const clear = (options.clearErrors && screenHasErrors) || (options.clearIfFirstLog && isFirstViteLog)
  if (clear) {
    const viteConfig = getViteConfig()
    assert(viteConfig)
    clearWithVite(viteConfig)
  }

  log(msg, logType)
}
function log(msg: unknown, logType: LogType) {
  if (logType === 'info') {
    console.log(msg)
  } else if (logType === 'warn') {
    console.warn(msg)
  } else if (logType === 'error') {
    screenHasErrors = true
    console.error(msg)
  } else if (logType === 'error-recover') {
    // stderr because user will most likely want to know about error recovering
    console.error(msg)
  } else {
    assert(false)
  }
}
function clearWithVite(viteConfig: ResolvedConfig) {
  screenHasErrors = false
  // We use Vite's logger in order to respect the user's `clearScreen: false` setting
  viteConfig.logger.clearScreen('error')
}

function logErrorNotProd(
  ...[err, { httpRequestId }, category = null]: LogErrorArgs | [...LogErrorArgs, LogCategory]
): boolean {
  const store = getAsyncHookStore()

  if (isRenderErrorPageException(err)) {
    return false
  }
  if (store?.hasErrorLogged(err)) {
    return false
  }

  if (store?.httpRequestId) {
    if (httpRequestId === null) {
      httpRequestId = store?.httpRequestId
    } else {
      assert(httpRequestId === store.httpRequestId)
    }
  }

  logErr(err, httpRequestId, category)
  return true
}
function logErr(err: unknown, httpRequestId: number | null, category: LogCategory): void {
  warnIfObjectIsNotObject(err)
  const store = getAsyncHookStore()
  store?.addLoggedError(err)

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
    log(err, 'error')
    return
  }

  const errWithCodeSnippet = getErrorWithCodeSnippet(err, httpRequestId, category)
  if (errWithCodeSnippet) {
    // logErrorIntro()/addPrefix() already called
    log(errWithCodeSnippet, 'error')
    logErrorDebugNote()
    return
  }

  logErrorIntro(err, httpRequestId, category)
  log(err, 'error')
  logErrorDebugNote()
}
function logErrorIntro(err: unknown, httpRequestId: number | null, category: null | LogCategory) {
  if (!isObject(err)) return
  if (introMsgs.has(err)) {
    const logInfoArgs = introMsgs.get(err)!
    logInfoNotProd(...logInfoArgs)
    return
  }
  if (!category && httpRequestId) {
    category = getCategoryRequest(httpRequestId)
  }
  const hook = isUserHookError(err)
  if (hook) {
    const { hookName, hookFilePath } = hook
    logInfoNotProd(pc.red(`Error thrown by hook ${hookName}() (${hookFilePath}):`), category, 'error')
    return
  }
  if (httpRequestId !== null) {
    logInfoNotProd(pc.red('Error thrown:'), category, 'error')
    return
  }
}

function logErrorDebugNote() {
  assert(!isErrorDebug())
  const msg = pc.dim(
    [
      '=======================================================================',
      "| Error isn't helpful? See https://vite-plugin-ssr.com/errors#verbose |",
      '======================================================================='
    ].join('\n')
  )
  log(msg, 'error')
}

function getErrorWithCodeSnippet(
  err: unknown,
  httpRequestId: number | null,
  category: null | LogCategory
): string | null {
  const errStr = getEsbuildFormattedError(err)
  if (errStr) {
    logErrorIntro(err, httpRequestId, category)
    return errStr
  }

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

/** Used by Vite logger interceptor, e.g. to log a message with the "[vite]" tag */
function logAsVite(
  msg: string,
  logType: LogType,
  httpRequestId: number | null,
  withTag: boolean,
  clear: boolean,
  viteConfig: ResolvedConfig
) {
  if (clear) clearWithVite(viteConfig)
  const category = httpRequestId ? getCategoryRequest(httpRequestId) : null
  if (withTag) {
    msg = addPrefix(msg, 'vite', category, logType)
  }
  log(msg, logType)
  if (logType === 'error') {
    logErrorDebugNote()
  }
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
