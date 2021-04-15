import { version } from '../package.json'
import { newError } from '@brillout/libassert'

export { assert }
export { assertUsage }
export { assertWarning }

const repoName = `vite-plugin-ssr@${version}`
const libName = repoName
const requestForContact = `Please open a new issue at https://github.com/brillout/${repoName}/issues/new and include this error stack.`
const internalErrorPrefix = `[${libName}][Internal Error]`
const usageErrorPrefix = `[${libName}][Wrong Usage]`
const warningPrefix = `[${libName}][Warning]`

function assert(condition: unknown /*, errorMessage = 'Something unexpected happened'*/): asserts condition {
  if (condition) {
    return
  }
  const errorMessage = 'Something unexpected happened'
  const internalError = newError(`${internalErrorPrefix} ${errorMessage}. ${requestForContact}`)
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
