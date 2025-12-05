export { getBetterError }

// TO-DO/eventually: make it a library `@brillout/better-error`
// TODO: fix? Reprod: 7f4baa40ec95fa55319f85a38a50291460790683

import { isObject } from './isObject.js'
import { assert } from './assert.js'

function getBetterError(
  err: unknown,
  modifications: { message?: string | { prepend?: string; append?: string }; stack?: string; hideStack?: true },
) {
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
  const { message: modsMessage, ...mods } = modifications
  Object.assign(errBetter, mods)
  if (modsMessage) {
    if (typeof modsMessage === 'string') {
      // Complete replacement - also remove prefix before old message (e.g., "SyntaxError: ")
      errBetter.message = modsMessage
      const oldMessageIndex = errBetter.stack.indexOf(errMessageOriginal)
      assert(oldMessageIndex >= 0)
      // Remove everything from start up to and including the old message
      const afterOldMessage = errBetter.stack.slice(oldMessageIndex + errMessageOriginal.length)
      errBetter.stack = modsMessage + afterOldMessage
    } else {
      // Prepend/append
      if (modsMessage.prepend) {
        errBetter.message = modsMessage.prepend + errBetter.message
        errBetter.stack = modsMessage.prepend + errBetter.stack
      }
      if (modsMessage.append) {
        const currentMessage = errBetter.message
        errBetter.message = currentMessage + modsMessage.append
        errBetter.stack = errBetter.stack.replaceAll(currentMessage, errBetter.message)
      }
    }
  }

  // Enable users to retrieve the original error
  Object.assign(errBetter, { getOriginalError: () => (err as any)?.getOriginalError?.() ?? err })

  return errBetter
}

// TO-DO/eventually: think about whether logging this warning is a good idea
function warnMalformed(err: unknown) {
  console.warn('Malformed error: ', err)
}
