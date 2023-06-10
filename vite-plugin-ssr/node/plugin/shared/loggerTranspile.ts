export { logWithVite }
export { logErrorWithVite }
export { clearScreenWithVite }
export { addErrorIntroMsg }
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
import { ifFrameError, formatFrameError } from './loggerTranspile/formatFrameError'
import { getEsbuildFormattedError } from './loggerTranspile/formatEsbuildError'

assertIsVitePluginCode()
logInfo_set(logWithVite)
logError_set(logErrorWithVite)

type LogCategory = 'config' | `request(${number})` | null
type LogType = 'error-recover' | 'error' | 'info'
type LogInfoArgs = Parameters<typeof logWithVite>
const introMsgs = new WeakMap<object, LogInfoArgs>()
let screenHasErrors = false

function logWithVite(
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

  if (logType === 'info') {
    console.log(msg)
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

function logErrorWithVite(
  ...[err, { httpRequestId }, category = null]: LogErrorArgs | [...LogErrorArgs, LogCategory]
): boolean {
  if (isRenderErrorPageException(err)) {
    return false
  }

  const store = getAsyncHookStore()
  if (store?.loggedErrors.includes(err)) {
    return false
  }

  screenHasErrors = true
  logErr(err, { httpRequestId }, category)
  store?.loggedErrors.push(err)
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

  const errFormatted = getFormattedError(err, httpRequestId, category)
  if (errFormatted) {
    // logErrorWithVite()/addPrefix() already called
    console.error(errFormatted)
    return
  }

  logErrorIntro(err, httpRequestId, category)
  console.error(err)
}
function logErrorIntro(err: unknown, httpRequestId: number | null, category: null | LogCategory) {
  if (!isObject(err)) return
  if (introMsgs.has(err)) {
    const logInfoArgs = introMsgs.get(err)!
    logWithVite(...logInfoArgs)
    return
  }
  if (!category) {
    category = getCategoryRequest(httpRequestId)
  }
  const hook = isUserHookError(err)
  if (hook) {
    const { hookName, hookFilePath } = hook
    logWithVite(pc.red(`Error thrown by hook ${hookName}() (${hookFilePath}):`), category, 'error')
    return
  }
  if (httpRequestId !== null) {
    logWithVite(pc.red('Error:'), category, 'error')
    return
  }
}

function getFormattedError(err: unknown, httpRequestId: number | null, category: null | LogCategory): string | null {
  if (ifFrameError(err)) {
    // We handle transpile errors globally because transpile errors can be thrown not only when calling viteDevServer.ssrLoadModule() but also later when calling user hooks (since Vite loads/transpiles user code in a lazy manner)
    const viteConfig = getViteConfig()
    assert(viteConfig)
    let errFormatted = formatFrameError(err, viteConfig.root)
    const category = getCategoryRequest(httpRequestId)
    errFormatted = addPrefix(errFormatted, 'vite', category, 'error')
    return errFormatted
  }

  const errFormatted = getEsbuildFormattedError(err)
  if (errFormatted) {
    logErrorIntro(err, httpRequestId, category)
    return errFormatted
  }

  return null
}

function getCategoryRequest(httpRequestId: number | null) {
  return httpRequestId ? (`request(${httpRequestId})` as const) : null
}

function addErrorIntroMsg(err: unknown, ...logInfoArgs: LogInfoArgs) {
  assert(isObject(err))
  introMsgs.set(err, logInfoArgs)
}

function addPrefix(msg: string, project: 'vite' | 'vite-plugin-ssr', category: LogCategory, logType: LogType) {
  const color = (s: string) => {
    if (project === 'vite-plugin-ssr') return pc.yellow(s)
    if (logType === 'info') return pc.cyan(s)
    if (logType === 'error') return pc.red(s)
    if (logType === 'error-recover') return pc.green(s)
    assert(false)
  }
  let tag = color(pc.bold(`[${project}]`))
  if (category) {
    tag = tag + pc.dim(`[${category}]`)
  }

  const timestamp = pc.dim(new Date().toLocaleTimeString())

  return `${timestamp} ${tag} ${msg}`
}
