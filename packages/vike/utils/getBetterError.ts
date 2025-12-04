export { getBetterError }

// TO-DO/eventually: make it a library `@brillout/release-me`

import { isObject } from './isObject.js'

function getBetterError(err: unknown, modifications: { message?: string; stack?: string; hideStack?: true }) {
  let errBetter: { message: string; stack: string }

  // Normalize
  if (!isObject(err)) {
    warnMalformed(err)
    errBetter = new Error(String(err)) as Required<Error>
  } else {
    errBetter = structuredClone(err) as any
  }
  errBetter.message ??= ''
  if (!errBetter.stack) {
    warnMalformed(err)
    errBetter.stack = new Error(errBetter.message).stack!
  }
  if (!errBetter.stack.includes(errBetter.message)) {
    warnMalformed(err)
  }

  // Modifications
  const errMessageOriginal = errBetter.message
  Object.assign(errBetter, modifications)
  if (modifications.message) errBetter.stack = errBetter.stack.replaceAll(errMessageOriginal, modifications.message)

  // Enable users to retrieve the original error
  Object.assign(errBetter, { getOriginalError: () => (err as any)?.getOriginalError?.() ?? err })

  return errBetter
}

// TO-DO/eventually: think about whether logging this warning is a good idea
function warnMalformed(err: unknown) {
  console.warn('Malformed error: ', err)
}
