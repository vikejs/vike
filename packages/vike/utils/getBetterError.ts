export { getBetterError }

// TO-DO/eventually: make it a library `@brillout/release-me`

import { isObject } from './isObject.js'

function getBetterError(err: unknown, modifications: { message?: string; stack?: string; stackIsOptional?: true }) {
  let errBetter: { message: string; stack: string }

  // Normalize & copy
  if (!isObject(err)) {
    warnMalformed(err)
    errBetter = new Error(String(err)) as Required<Error>
  } else {
    errBetter = structuredClone(err) as any
    errBetter.message ??= ''
    if (!err.stack) {
      warnMalformed(err)
      errBetter.stack = new Error(errBetter.message).stack!
    } else {
      if (!errBetter.stack.includes(errBetter.message)) warnMalformed(err)
    }
  }

  // Modifications
  const errMessage = errBetter.message
  Object.assign(errBetter, modifications)
  if (modifications.message) errBetter.stack = errBetter.stack.replaceAll(errMessage, modifications.message)

  // https://gist.github.com/brillout/066293a687ab7cf695e62ad867bc6a9c
  Object.assign(errBetter, { getOriginalError: () => err })

  return errBetter
}

// TO-DO/eventually: think about whether logging this warning is a good idea
function warnMalformed(err: unknown) {
  console.warn('Malformed error: ', err)
}
