export { getBetterError }

// TO-DO/maybe: make it a library `@brillout/better-error`

// Copies:
// - https://github.com/brillout/react-streaming/blob/b8565c1257c63a665bda31b9be42112e458859d1/src/utils/getBetterError.ts
// - https://github.com/vikejs/vike-react/blob/5477461e67592e24d2aa38a552703b9e76a01d2a/packages/vike-react/src/utils/getBetterErrorLight.ts

import { isObject } from './isObject.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
import { objectAssign } from './objectAssign.js'
import { shallowClone } from './shallowClone.js'
import { objectKeys } from './objectKeys.js'
assertIsNotBrowser()

function getBetterError(
  err: unknown,
  modifications: { message?: string | { prepend?: string; append?: string }; stack?: string; hideStack?: true },
) {
  const errOriginal = shallowClone(err)

  let errBetter: { name?: string; message: string; stack: string; hideStack?: true }

  // Normalize
  if (!isObject(err)) {
    warnMalformed(errOriginal)
    errBetter = new Error(String(err)) as Required<Error>
  } else {
    // We mutate instead of structuredClone(err) to avoid breaking Vite's ssrFixStacktrace() internal rewroteStacktraces.has(err) check
    // https://github.com/vitejs/vite/blob/dafd726032daa98d0e614f97aebe9d4dbffe2ea7/packages/vite/src/node/ssr/ssrStacktrace.ts#L95
    errBetter = err as any
  }
  if (!errBetter.message) {
    set(errBetter, 'message', '')
  }
  if (!errBetter.stack) {
    warnMalformed(errOriginal)
    set(errBetter, 'stack', new Error(errBetter.message).stack!)
  }

  // Modifications: err.hideStack and err.stack
  const { message: modsMessage, ...mods } = modifications
  for (const prop of objectKeys(mods)) set(errBetter, prop, mods[prop])

  // Modifications: err.message
  if (typeof modsMessage === 'string') {
    // Modify err.message
    const messagePrev = errBetter.message
    const messageNext = modsMessage
    set(errBetter, 'message', messageNext)
    // Update err.stack
    const messagePrevIdx = errBetter.stack.indexOf(messagePrev)
    if (messagePrevIdx >= 0) {
      // Completely replace the beginning of err.stack — removing prefix such as "SyntaxError: "
      // - Following isn't always true: `err.stack.startsWith(err.message)` — because err.stack can start with "SyntaxError: " whereas err.message doesn't
      const stack = errBetter.stack.slice(messagePrevIdx + messagePrev.length)
      set(errBetter, 'stack', messageNext + stack)
    } else {
      warnMalformed(errOriginal)
    }
  } else {
    if (modsMessage?.append) {
      const { append } = modsMessage
      const messagePrev = errBetter.message
      set(errBetter, 'message', messagePrev + append)
      // Update err.stack
      const messageEnd = getMessageEnd(errBetter.stack, messagePrev, errBetter.name)
      if (messageEnd !== null) {
        const { stack } = errBetter
        set(errBetter, 'stack', stack.slice(0, messageEnd) + append + stack.slice(messageEnd))
      }
    }
    if (modsMessage?.prepend) {
      const { prepend } = modsMessage
      set(errBetter, 'message', prepend + errBetter.message)
      set(errBetter, 'stack', prepend + errBetter.stack)
    }
  }

  // Enable users to retrieve the original error
  objectAssign(errBetter, { getOriginalError: () => (errOriginal as any)?.getOriginalError?.() ?? errOriginal })

  return errBetter
}

// After a `prepend`, err.stack is `${prepend}SyntaxError: ${message}` whereas err.message is `${prepend}${message}`
function getMessageEnd(stack: string, message: string, name: string | undefined): number | null {
  let sharedLength = 0
  while (sharedLength < message.length && message[sharedLength] === stack[sharedLength]) sharedLength++
  // Check the name first: the message can also be found inside it, e.g. `new SyntaxError('a')`
  if (name) {
    for (let prependLength = 0; prependLength <= sharedLength; prependLength++) {
      const messageRest = message.slice(prependLength)
      // V8 omits ": " if the message is empty
      const messageStack = messageRest ? `${name}: ${messageRest}` : name
      if (stack.startsWith(messageStack, prependLength)) return prependLength + messageStack.length
    }
  }
  for (let prependLength = 0; prependLength <= sharedLength; prependLength++) {
    const messageRest = message.slice(prependLength)
    const messageRestIdx = stack.indexOf(messageRest, prependLength)
    if (messageRestIdx >= 0) return messageRestIdx + messageRest.length
  }
  return null
}

// The property can be read-only, e.g. the `message` getter of a DOMException
function set<Err extends object, Prop extends keyof Err>(err: Err, prop: Prop, value: Err[Prop]) {
  try {
    err[prop] = value
  } catch {
    Object.defineProperty(err, prop, { value, writable: true, configurable: true, enumerable: false })
  }
}

// TO-DO/eventually: think about whether logging this warning is a good idea
function warnMalformed(errOriginal: unknown) {
  console.warn('Malformed error: ', errOriginal)
}
