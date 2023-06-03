export { handleUserFileError }
export { handleUserFileSuccess }
export { userFilesHaveError }

import { getGlobalContext } from '../../../../runtime/globalContext'
import { FilePath, getFilePathToShowToUser } from './getConfigData'
import pc from '@brillout/picocolors'

const userFilesWithErrors = new Set<string>()

function userFilesHaveError(): boolean {
  return userFilesWithErrors.size > 0
}
function handleUserFileError(err: unknown, introMsgPrefix: string, filePath: FilePath) {
  userFilesWithErrors.add(filePath.filePathAbsolute)
  addIntroMessage(err, `${introMsgPrefix} ${getFilePathToShowToUser(filePath)}`)
  logErrorWithIntroMessage(err)
}
function handleUserFileSuccess(filePath: FilePath) {
  const hadError = userFilesHaveError()
  userFilesWithErrors.delete(filePath.filePathAbsolute)
  if (hadError && !userFilesHaveError()) {
    const globalContext = getGlobalContext()
    if (globalContext.viteDevServer) {
      globalContext.viteDevServer.restart(true)
    }
  }
}

type ErrorWithIntroMsg = Error & { _introMsg?: string }
function addIntroMessage(err_: unknown, introMsg: string) {
  const err = err_ as ErrorWithIntroMsg
  err._introMsg = introMsg
}
function logErrorWithIntroMessage(err_: unknown) {
  const err = err_ as ErrorWithIntroMsg
  const introMsg = err._introMsg
  if (introMsg) {
    console.error(pc.red(introMsg))
  }
  console.error(err_)
}
