export { getBetterError }

// TO-DO/eventually: make it a library `@brillout/better-error`
// TODO: fix? Reprod: 7f4baa40ec95fa55319f85a38a50291460790683

import { isObject } from './isObject.js'

function getBetterError(err: unknown, modifications: { message?: string | { prepend?: string; append?: string; }, stack?: string; hideStack?: true }) {
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
  const { message: _ , ...mods} = modifications
  Object.assign(errBetter, mods)
  if (modifications.message?.prepend) {
    errBetter.message = modifications.message.prepend + errBetter.message
    errBetter.stack = modifications.message.prepend + errBetter.stack
  }
  if (modifications.message?.append) {
    const errMessageOriginal = errBetter.message
    errBetter.message = modifications.message.prepend + errBetter.message
    errBetter.stack = errBetter.stack.replaceAll(errMessageOriginal, errBetter.message)
  }

  // Enable users to retrieve the original error
  Object.assign(errBetter, { getOriginalError: () => (err as any)?.getOriginalError?.() ?? err })

  return errBetter
}

// TO-DO/eventually: think about whether logging this warning is a good idea
function warnMalformed(err: unknown) {
  console.warn('Malformed error: ', err)
}
