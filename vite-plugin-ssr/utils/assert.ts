import { newError } from '@brillout/libassert'
import { projectInfo } from './projectInfo'

export { assert }
export { assertUsage }
export { assertWarning }
export { assertInfo }
export { getProjectError }

const errorPrefix = `[${projectInfo.npmPackageName}@${projectInfo.projectVersion}]`
const internalErrorPrefix = `${errorPrefix}[Bug]`
const usageErrorPrefix = `${errorPrefix}[Wrong Usage]`
const warningPrefix = `${errorPrefix}[Warning]`
const infoPrefix = `${errorPrefix}[Info]`

const numberOfStackTraceLinesToRemove = 2

function assert(condition: unknown, debugInfo?: unknown): asserts condition {
  if (condition) {
    return
  }

  const debugStr = (() => {
    if (!debugInfo) {
      return ''
    }
    const debugInfoSerialized = typeof debugInfo === 'string' ? debugInfo : '`' + JSON.stringify(debugInfo) + '`'
    return `Debug info (this is for the ${projectInfo.projectName} maintainers; you can ignore this): ${debugInfoSerialized}.`
  })()

  const internalError = newError(
    [
      `${internalErrorPrefix} You stumbled upon a bug in ${projectInfo.projectName}'s source code.`,
      `Reach out at ${projectInfo.githubRepository}/issues/new or ${projectInfo.discordInviteToolChannel} and include this error stack (the error stack is usually enough to fix the problem).`,
      'A maintainer will fix the bug (usually under 24 hours).',
      `Do not hesitate to reach out as it makes ${projectInfo.projectName} more robust.`,
      debugStr,
    ].join(' '),
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

function getProjectError(errorMessage: string) {
  const pluginError = newError(`${errorPrefix} ${errorMessage}`, numberOfStackTraceLinesToRemove)
  return pluginError
}

let loggedWarnings: Set<string> = new Set()
function assertWarning(condition: unknown, errorMessage: string, { onlyOnce }: { onlyOnce: boolean | string }): void {
  if (condition) {
    return
  }
  const msg = `${warningPrefix} ${errorMessage}`
  if (onlyOnce) {
    const key = onlyOnce === true ? msg : onlyOnce
    if (loggedWarnings.has(key)) {
      return
    } else {
      loggedWarnings.add(key)
    }
  }
  console.warn(msg)
}

function assertInfo(condition: unknown, errorMessage: string): void {
  if (condition) {
    return
  }
  console.warn(`${infoPrefix} ${errorMessage}`)
}
