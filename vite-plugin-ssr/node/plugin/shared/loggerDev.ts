export { logInfoDev }
export { addErrorIntroMsg }
export type { LogArgs }

import pc from '@brillout/picocolors'
import { LogType } from 'vite'
import { getViteDevServer, isGlobalContextSet } from '../../runtime/globalContext'
import { LogErrorArgs, logError_set, logInfo_set, prodLogError } from '../../runtime/renderPage/logger'
import { assert, assertIsVitePluginCode, isObject, projectInfo } from '../utils'

assertIsVitePluginCode()
logInfo_set(logInfoDev)
logError_set(logErrorDev)

const introMsgs = new WeakMap<object, LogArgs>()

type LogArgs = [
  msg: string,
  category: 'config' | 'request' | `request-${number}`,
  type: 'error-recover' | 'error' | 'info'
]

function logErrorDev(...[err, { httpRequestId, canBeViteUserLand }]: LogErrorArgs) {
  if (isObject(err)) {
    if (introMsgs.has(err)) {
      const logArg = introMsgs.get(err)!
      logInfoDev(...logArg)
    }
    if ('_esbuildMessageFormatted' in err) {
      console.error(err._esbuildMessageFormatted)
      return
    }
  }
  prodLogError(err, { httpRequestId, canBeViteUserLand })
}

function logInfoDev(...[msgInfo, category, type]: LogArgs) {
  let tagCategory = pc.dim(`[${category}]`)
  let logType: LogType
  if (type === 'info') {
    logType = 'info'
  } else if (type === 'error-recover') {
    logType = 'error'
  } else if (type === 'error') {
    logType = 'error'
  } else {
    assert(false)
  }
  const tag = pc.yellow(pc.bold(`[${projectInfo.projectName}]`)) + tagCategory
  const msg = `${pc.dim(new Date().toLocaleTimeString())} ${tag} ${msgInfo}`
  const viteDevServer = getViteDevServer()
  if (viteDevServer) {
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

function addErrorIntroMsg(err: unknown, ...logArg: LogArgs) {
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
