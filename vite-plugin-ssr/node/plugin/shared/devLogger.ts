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

type LogArgs = [msg: string, category: 'config' | 'request', type: 'success' | 'failure' | 'info']

function logDevError(err: unknown) {
  if (isObject(err)) {
    if ('_introMsg' in err) {
      const errorWithIntroMsg = err as ErrorWithIntroMsg
      const [msg, category, type] = errorWithIntroMsg._introMsg
      logDevInfo(msg, category, type)
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

type ErrorWithIntroMsg = { _introMsg: LogArgs }
function addErrorIntroMsg(err_: unknown, ...[msg, category, type]: LogArgs) {
  const err = err_ as ErrorWithIntroMsg
  err._introMsg = [msg, category, type]
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
