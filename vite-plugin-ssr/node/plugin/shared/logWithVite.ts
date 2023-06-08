export { logWithVite }
export { addErrorIntroMsg }
export type { LogInfoArgs }

import pc from '@brillout/picocolors'
import { isRenderErrorPageException } from '../../../shared/route/RenderErrorPage'
import { getGlobalContext, getViteConfig, isGlobalContextSet } from '../../runtime/globalContext'
import { LogErrorArgs, logError_set, logInfo_set, prodLogError } from '../../runtime/renderPage/logger'
import { assert, assertIsVitePluginCode, isObject, isUserHookError, projectInfo } from '../utils'

assertIsVitePluginCode()
logInfo_set(logWithVite)
logError_set(logErrorWithVite)

const introMsgs = new WeakMap<object, LogInfoArgs>()
let screenHasErrors = false

type LogInfoArgs = [
  msg: string,
  category: 'config' | `request(${number})` | null,
  type: 'error-recover' | 'error' | 'info',
  options?: undefined | { clearErrors: boolean }
]

function logErrorWithVite(...[err, { httpRequestId, canBeViteUserLand }]: LogErrorArgs) {
  if (isRenderErrorPageException(err)) {
    assert(canBeViteUserLand)
    return
  }
  screenHasErrors = true
  logErrorIntro(err, httpRequestId)
  if (isObject(err)) {
    if ('_esbuildMessageFormatted' in err) {
      console.error(err._esbuildMessageFormatted)
      return
    }
  }
  prodLogError(err, { httpRequestId, canBeViteUserLand })
}

function logErrorIntro(err: unknown, httpRequestId: number | null) {
  if (!isObject(err)) return
  if (introMsgs.has(err)) {
    const logArg = introMsgs.get(err)!
    logWithVite(...logArg)
    return
  }
  const category = httpRequestId ? (`request(${httpRequestId})` as const) : null
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

function logWithVite(...args: LogInfoArgs) {
  logInfo(...args, true)
}

function logInfo(...[msg, category, type, options, canBePrerender]: [...LogInfoArgs, boolean]) {
  {
    let tag = pc.yellow(pc.bold(`[${projectInfo.projectName}]`))
    if (category) {
      tag = tag + pc.dim(`[${category}]`)
    }
    msg = `${tag} ${msg}`
  }
  {
    const showTimestamp = !canBePrerender || !isGlobalContextSet() || !getGlobalContext().isPrerendering
    if (showTimestamp) {
      msg = `${pc.dim(new Date().toLocaleTimeString())} ${msg}`
    }
  }
  const viteConfig = getViteConfig()
  if (viteConfig) {
    {
      const clear =
        (category === 'config' && (type === 'error' || type === 'error-recover')) ||
        (options?.clearErrors && screenHasErrors)
      if (clear) {
        viteConfig.logger.clearScreen('error')
        screenHasErrors = false
      }
    }
    {
      const logType = type === 'info' ? 'info' : 'error'
      viteConfig.logger[logType](msg)
    }
  } else {
    assert(!isGlobalContextSet())
    if (type === 'error') {
      console.error(msg)
    } else {
      console.log(msg)
    }
  }
}

function addErrorIntroMsg(err: unknown, ...logArg: LogInfoArgs) {
  assert(isObject(err))
  introMsgs.set(err, logArg)
}

/* TODO: remove?
let msgPrev: string | undefined
const zeroWidthSpace = '\u200b'
function addStringIsEqualBuster(msg: string) {
  if (!process.stdout.isTTY || process.env.CI) {
    // Workaround isn't needed: https://github.com/vitejs/vite/blob/02a46d7ceab71ebf7ba723372ba37012b7f9ccaf/packages/vite/src/node/logger.ts#L65-L66
    return msg
  }
  if (msgPrev === msg) {
    msg = msg + zeroWidthSpace
  }
  msgPrev = msg
  return msg
}
*/
