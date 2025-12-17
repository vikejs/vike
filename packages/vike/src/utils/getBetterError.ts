export { getBetterError }

// TO-DO/maybe: make it a library `@brillout/better-error`

// Copies:
// - https://github.com/brillout/react-streaming/blob/b8565c1257c63a665bda31b9be42112e458859d1/src/utils/getBetterError.ts
// - https://github.com/vikejs/vike-react/blob/5477461e67592e24d2aa38a552703b9e76a01d2a/packages/vike-react/src/utils/getBetterErrorLight.ts

import { isObject } from './isObject.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
import { objectAssign } from './objectAssign.js'
import { shallowClone } from './shallowClone.js'
assertIsNotBrowser()

function getBetterError(
  err: unknown,
  modifications: { message?: string | { prepend?: string; append?: string }; stack?: string; hideStack?: true },
) {
  const errOriginal = shallowClone(err)

  let errBetter: { message: string; stack: string; hideStack?: true }

  // Normalize
  if (!isObject(err)) {
    warnMalformed(errOriginal)
    errBetter = new Error(String(err)) as Required<Error>
  } else {
    // We mutate instead of structuredClone(err) to avoid breaking Vite's ssrFixStacktrace() internal rewroteStacktraces.has(err) check
    // https://github.com/vitejs/vite/blob/dafd726032daa98d0e614f97aebe9d4dbffe2ea7/packages/vite/src/node/ssr/ssrStacktrace.ts#L95
    errBetter = err as any
  }
  errBetter.message ??= ''
  if (!errBetter.stack) {
    warnMalformed(errOriginal)
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
      warnMalformed(errOriginal)
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
  objectAssign(errBetter, { getOriginalError: () => (errOriginal as any)?.getOriginalError?.() ?? errOriginal })

  return errBetter
}

// TO-DO/eventually: think about whether logging this warning is a good idea
function warnMalformed(errOriginal: unknown) {
  console.warn('Malformed error: ', errOriginal)
}
