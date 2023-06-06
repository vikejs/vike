export { logDevError }
export { logDevInfo }
export { addErrorIntroMsg }
export type { LogArgs }

import pc from '@brillout/picocolors'
import { getViteDevServer } from '../../runtime/globalContext'
import { logRuntimeMsg_set } from '../../runtime/renderPage/runtimeLogger'
import { projectInfo } from '../utils'

logRuntimeMsg_set(logDevInfo)

type LogArgs = [msg: string, category: 'config' | 'request', type: 'success' | 'failure' | 'info']

function logDevError(err: unknown) {
  logErrorWithIntroMessage(err)
}

function logDevInfo(...[msgInfo, category, type]: LogArgs) {
  const viteDevServer = getViteDevServer()
  if (!viteDevServer) return
  let tagCategory = pc.bold(`[${category}]`)
  if (type === 'success') {
    tagCategory = pc.green(tagCategory)
  }
  if (type === 'failure') {
    tagCategory = pc.red(tagCategory)
  }
  if (type === 'info') {
    tagCategory = pc.magenta(tagCategory)
  }
  const tag = pc.cyan(pc.bold(`[${projectInfo.projectName}]`)) + tagCategory
  viteDevServer.config.logger.info(`${pc.dim(new Date().toLocaleTimeString())} ${tag} ${msgInfo}`, { clear: false })
}

type ErrorWithIntroMsg = Error & { _introMsg?: string }
function addErrorIntroMsg(err_: unknown, introMsg: string) {
  const err = err_ as ErrorWithIntroMsg
  err._introMsg = introMsg
}
function logErrorWithIntroMessage(err_: unknown) {
  const err = err_ as ErrorWithIntroMsg
  const introMsg = err._introMsg
  if (introMsg) {
    console.error(pc.red(pc.bold(introMsg)))
  }
  console.error(err_)
}
