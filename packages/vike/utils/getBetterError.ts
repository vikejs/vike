export { getBetterError }

// TO-DO/maybe: make it a library `@brillout/better-error`

import { isObject } from './isObject.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
import { objectAssign } from './objectAssign.js'
assertIsNotBrowser()

function getBetterError(
  err: unknown,
  modifications: { message?: string | { prepend?: string; append?: string }; stack?: string; hideStack?: true },
) {
  let errBetter: { message: string; stack: string; hideStack?: true }

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

  // Modifications: err.hideStack and err.stack
  const { message: modsMessage, ...mods } = modifications
  Object.assign(errBetter, mods)

  // Modifications: err.message
  if (typeof modsMessage === 'string') {
    // Modify err.message
    const messagePrev = errBetter.message
    const messageNext = modsMessage
    errBetter.message = messageNext
    // Update err.stack
    const messagePrevIdx = errBetter.stack.indexOf(messagePrev)
    if (messagePrevIdx >= 0) {
      // Completely replace the beginning of err.stack — removing prefix such as "SyntaxError: "
      // - Following isn't always true: `err.stack.startsWith(err.message)` — because err.stack can start with "SyntaxError: " whereas err.message doesn't
      const stack = errBetter.stack.slice(messagePrevIdx + messagePrev.length)
      errBetter.stack = messageNext + stack
    } else {
      warnMalformed(err)
    }
  } else {
    if (modsMessage?.append) {
      const messagePrev = errBetter.message
      const messageNext = errBetter.message + modsMessage.append
      errBetter.message = messageNext
      errBetter.stack = errBetter.stack.replace(messagePrev, messageNext)
    }
    if (modsMessage?.prepend) {
      const { prepend } = modsMessage
      errBetter.message = prepend + errBetter.message
      errBetter.stack = prepend + errBetter.stack
    }
  }

  // Enable users to retrieve the original error
  objectAssign(errBetter, { getOriginalError: () => (err as any)?.getOriginalError?.() ?? err })

  return errBetter
}

// TO-DO/eventually: think about whether logging this warning is a good idea
function warnMalformed(err: unknown) {
  console.warn('Malformed error: ', err)
}
