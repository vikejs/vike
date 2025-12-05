export { getBetterError }

// TO-DO/eventually: make it a library `@brillout/better-error`

import { isObject } from './isObject.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
assertIsNotBrowser()

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

  // Modifications
  const { message: modsMessage, ...mods } = modifications
  Object.assign(errBetter, mods)
  if (typeof modsMessage === 'string') {
    const messagePrev = errBetter.message
    errBetter.message = modsMessage
    const oldMessageIndex = errBetter.stack.indexOf(messagePrev)
    if (oldMessageIndex >= 0) {
      // Completely replace the beginning of err.stack — removing prefix such as "SyntaxError: "
      // - Following isn't always true: `err.stack.startsWith(err.message)` — because err.stack can start with "SyntaxError: " where err.message doesn't
      const afterOldMessage = errBetter.stack.slice(oldMessageIndex + messagePrev.length)
      errBetter.stack = modsMessage + afterOldMessage
    } else {
      warnMalformed(err)
    }
  } else if (modsMessage?.prepend) {
    errBetter.message = modsMessage.prepend + errBetter.message
    errBetter.stack = modsMessage.prepend + errBetter.stack
  } else if (modsMessage?.append) {
    const messagePrev = errBetter.message
    errBetter.message = errBetter.message + modsMessage.append
    errBetter.stack = errBetter.stack.replace(messagePrev, errBetter.message)
  }

  // Enable users to retrieve the original error
  Object.assign(errBetter, { getOriginalError: () => (err as any)?.getOriginalError?.() ?? err })

  return errBetter
}

// TO-DO/eventually: think about whether logging this warning is a good idea
function warnMalformed(err: unknown) {
  console.warn('Malformed error: ', err)
}
