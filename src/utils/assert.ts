import { version } from '../package.json'
import { newError } from '@brillout/libassert'

export { assert }
export { assertUsage }
export { assertWarning }

const libName = `vite-plugin-ssr`
const npmPackage = `${libName}@${version}`
const internalErrorPrefix = `[${npmPackage}][Internal Failure]`
const usageErrorPrefix = `[${npmPackage}][Wrong Usage]`
const warningPrefix = `[${npmPackage}][Warning]`

function assert(condition: unknown): asserts condition {
  if (condition) {
    return
  }
  const internalError = newError(
    `${internalErrorPrefix} You stumbled upon an bug in \`${libName}\`'s source code (an internal assertion failed). This should definitely not be happening, and you should create a new issue at https://github.com/brillout/${libName}/issues/new that includes this error stack (the error stack is enough to debug this). Or reach out on Discord. A fix will be written promptly.`
  )
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
