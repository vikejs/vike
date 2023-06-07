export { logInfoDev }
export { addErrorIntroMsg }
export type { LogInfoArgs }

import pc from '@brillout/picocolors'
import { getGlobalContext, getViteDevServer, isGlobalContextSet } from '../../runtime/globalContext'
import { LogErrorArgs, logError_set, logInfo_set, prodLogError } from '../../runtime/renderPage/logger'
import { assert, assertIsVitePluginCode, isObject, projectInfo } from '../utils'

assertIsVitePluginCode()
logInfo_set(logInfoDevOrPrerender)
logError_set(logErrorDevOrPrerender)

const introMsgs = new WeakMap<object, LogInfoArgs>()

type LogInfoArgs = [msg: string, category: 'config' | `request(${number})`, type: 'error-recover' | 'error' | 'info']

function logErrorDevOrPrerender(...[err, { httpRequestId, canBeViteUserLand }]: LogErrorArgs) {
  if (isObject(err)) {
    if (introMsgs.has(err)) {
      const logArg = introMsgs.get(err)!
      logInfoDevOrPrerender(...logArg)
    } else if (httpRequestId !== null) {
      logInfoDevOrPrerender(pc.red('Error:'), `request(${httpRequestId})`, 'error')
    }
    if ('_esbuildMessageFormatted' in err) {
      console.error(err._esbuildMessageFormatted)
      return
    }
  }
  prodLogError(err, { httpRequestId, canBeViteUserLand })
}

function logInfoDev(...args: LogInfoArgs) {
  assert(getViteDevServer())
  assert(getGlobalContext().isProduction === false)
  logInfo(...args, false)
}
function logInfoDevOrPrerender(...args: LogInfoArgs) {
  logInfo(...args, true)
}

function logInfo(...[msg, category, type, canBePrerender]: [...LogInfoArgs, boolean]) {
  {
    const tagCategory = pc.dim(`[${category}]`)
    const tag = pc.yellow(pc.bold(`[${projectInfo.projectName}]`)) + tagCategory
    msg = `${tag} ${msg}`
  }
  {
    const showTimestamp = !canBePrerender || (isGlobalContextSet() && getGlobalContext().isPrerendering)
    if (showTimestamp) {
      msg = `${pc.dim(new Date().toLocaleTimeString())} ${msg}`
    }
  }
  const viteDevServer = getViteDevServer()
  if (viteDevServer) {
    const logType = type === 'info' ? 'info' : 'error'
    viteDevServer.config.logger[logType](msg)
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
