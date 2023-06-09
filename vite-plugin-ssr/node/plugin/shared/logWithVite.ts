export { logWithVite }
export { clearScreenWithVite }
export { addErrorIntroMsg }
export type { LogInfoArgs }

import pc from '@brillout/picocolors'
import type { ResolvedConfig } from 'vite'
import { isRenderErrorPageException } from '../../../shared/route/RenderErrorPage'
import { getViteConfig } from '../../runtime/globalContext'
import { LogErrorArgs, logError_set, logInfo_set, prodLogError } from '../../runtime/renderPage/logger'
import { isFirstViteLog } from '../plugins/devConfig/customClearScreen'
import { assert, assertIsVitePluginCode, isObject, isUserHookError, projectInfo } from '../utils'
import { isRollupError, formatRollupError } from './formatRollupError'
import { isErrorDebug } from './isErrorDebug'

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

  const type = logType === 'info' ? 'info' : 'error'
  viteConfig.logger[type](msg, {
    // @ts-expect-error
    _isFromVike: true
  })
}
function clearScreenWithVite(viteConfig: ResolvedConfig) {
  screenHasErrors = false
  viteConfig.logger.clearScreen('error')
}

function logErrorWithVite(...[err, { httpRequestId, canBeViteUserLand }]: LogErrorArgs): boolean {
  if (isRenderErrorPageException(err)) {
    assert(canBeViteUserLand)
    return false
  }

  screenHasErrors = true

  if (isRollupError(err)) {
    // We handle transpile errors globally because transpile errors can be thrown not only when calling viteDevServer.ssrLoadModule() but also later when calling user hooks (since Vite loads/transpiles user code in a lazy manner)
    if (isErrorDebug()) {
      logErrorIntro(err, httpRequestId)
      console.error(err)
    } else {
      const viteConfig = getViteConfig()
      assert(viteConfig)
      let errMsg = formatRollupError(err, viteConfig.root)
      const category = getCategoryRequest(httpRequestId)
      errMsg = addPrefix(errMsg, 'vite', category, 'error')
      console.error(errMsg)
    }
    return true
  }

  if (isObject(err)) {
    if ('_esbuildMessageFormatted' in err) {
      logErrorIntro(err, httpRequestId)
      console.error(err._esbuildMessageFormatted)
      return true
    }
  }

  logErrorIntro(err, httpRequestId)
  const logged = prodLogError(err, { httpRequestId, canBeViteUserLand })
  assert(logged === true) // otherwise breaks logErrorIntro() and screenHasErrors logic
  return logged
}
function logErrorIntro(err: unknown, httpRequestId: number | null) {
  if (!isObject(err)) return
  if (introMsgs.has(err)) {
    const logInfoArgs = introMsgs.get(err)!
    logWithVite(...logInfoArgs)
    return
  }
  const category = getCategoryRequest(httpRequestId)
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
