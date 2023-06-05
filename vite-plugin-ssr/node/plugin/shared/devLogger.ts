export { logDevError }
export { addErrorIntroMsg }

import pc from '@brillout/picocolors'

function logDevError(err: unknown) {
  logErrorWithIntroMessage(err)
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
    console.error(pc.red(introMsg))
  }
  console.error(err_)
}
