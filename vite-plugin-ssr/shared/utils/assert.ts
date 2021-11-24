import { newError } from '@brillout/libassert'
import { projectInfo } from './projectInfo'

export { assert }
export { assertUsage }
export { assertWarning }
export { getPluginError }

const errorPrefix = `[${projectInfo.npmPackageName}@${projectInfo.projectVersion}]`
const internalErrorPrefix = `${errorPrefix}[Internal Failure]`
const usageErrorPrefix = `${errorPrefix}[Wrong Usage]`
const warningPrefix = `${errorPrefix}[Warning]`

const numberOfStackTraceLinesToRemove = 2

function assert(condition: unknown, debugInfo?: unknown): asserts condition {
  if (condition) {
    return
  }
  const debugStr = !debugInfo
    ? ''
    : ` Debug info (this is for the \`${
        projectInfo.projectName
      }\` maintainers; you can ignore this): \`${JSON.stringify(debugInfo)}\`.`
  const internalError = newError(
    `${internalErrorPrefix} You stumbled upon a bug in \`${projectInfo.projectName}\`'s source code (an internal \`assert()\` failed). This should definitely not be happening, and you should create a new GitHub issue at ${projectInfo.githubRepository}/issues/new that includes this error stack (the error stack is usually enough to debug internal errors). Or reach out on Discord. A fix will be written promptly.${debugStr}`,
    numberOfStackTraceLinesToRemove,
  )
  throw internalError
}

function assertUsage(condition: unknown, errorMessage: string): asserts condition {
  if (condition) {
    return
  }
  const whiteSpace = errorMessage.startsWith('[') ? '' : ' '
  const usageError = newError(`${usageErrorPrefix}${whiteSpace}${errorMessage}`, numberOfStackTraceLinesToRemove)
  throw usageError
}

function getPluginError(errorMessage: string) {
  const pluginError = newError(`${errorPrefix} ${errorMessage}`, numberOfStackTraceLinesToRemove)
  return pluginError
}

function assertWarning(condition: unknown, errorMessage: string): void {
  if (condition) {
    return
  }
  console.warn(`${warningPrefix} ${errorMessage}`)
}
