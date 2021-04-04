import { newError } from '@brillout/libassert'

export { assert }
export { assertUsage }
export { assertWarning }

const repoName = 'vite-plugin-ssr'
const libName = repoName
const requestForContact = `Please open a new issue at https://github.com/brillout/${repoName}/issues/new and include this error stack.`
const internalErroPrefix = `[${libName}][Internal Error] Something unexpected happened. ${requestForContact}`
const usageErrorPrefix = `[${libName}][Wrong Usage]`
const warningPrefix = `[${libName}][Warning]`

function assert(condition: unknown): asserts condition {
  if (condition) {
    return
  }
  const internalError = newError(internalErroPrefix)
  throw internalError
}

function assertUsage(condition: unknown, errorMessage: string): asserts condition {
  if (condition) {
    return
  }
  const usageError = newError(`${usageErrorPrefix} ${errorMessage}`)
  throw usageError
}

function assertWarning(condition: unknown, errorMessage: string): void {
  if (condition) {
    return
  }
  console.warn(`${warningPrefix} ${errorMessage}`)
}
