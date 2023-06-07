export { logDevError }
export { logDevInfo }
export { addErrorIntroMsg }
export type { LogArgs }

import pc from '@brillout/picocolors'
import { LogType } from 'vite'
import { getViteDevServer, isGlobalContextSet } from '../../runtime/globalContext'
import { logRuntimeMsg_set } from '../../runtime/renderPage/runtimeLogger'
import { assert, isObject, projectInfo } from '../utils'

logRuntimeMsg_set(logDevInfo)

const introMsgs = new WeakMap<object, LogArgs>()

type LogArgs = [msg: string, category: 'config' | 'request', type: 'success' | 'failure' | 'info']

function logDevError(err: unknown) {
  if (isObject(err)) {
    if (introMsgs.has(err)) {
      const logArg = introMsgs.get(err)!
      logDevInfo(...logArg)
    }
    if ('_esbuildMessageFormatted' in err) {
      console.error(err._esbuildMessageFormatted)
      return
    }
  }
  console.error(err)
}

function logDevInfo(...[msgInfo, category, type]: LogArgs) {
  const viteDevServer = getViteDevServer()
  if (!viteDevServer && isGlobalContextSet()) return
  let tagCategory = pc.bold(`[${category}]`)
  let logType: LogType
  if (type === 'info') {
    tagCategory = pc.magenta(tagCategory)
    logType = 'info'
  } else if (type === 'success') {
    tagCategory = pc.green(tagCategory)
    logType = 'error'
  } else if (type === 'failure') {
    tagCategory = pc.red(tagCategory)
    logType = 'error'
  } else {
    assert(false)
  }
  const tag = pc.cyan(pc.bold(`[${projectInfo.projectName}]`)) + tagCategory
  const msg = `${pc.dim(new Date().toLocaleTimeString())} ${tag} ${msgInfo}`
  if (viteDevServer) {
    viteDevServer.config.logger[logType](msg)
  } else {
    if (type === 'failure') {
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
