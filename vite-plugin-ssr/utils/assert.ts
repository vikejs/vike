export { assert }
export { assertUsage }
export { assertWarning }
export { assertInfo }
export { getProjectError }
export { logPrefix }
export { addOnBeforeLogHook }

import { createErrorWithCleanStackTrace } from './createErrorWithCleanStackTrace'
import { getGlobalObject } from './getGlobalObject'
import { projectInfo } from './projectInfo'
const globalObject = getGlobalObject<{ alreadyLogged: Set<string>; onBeforeLog?: () => void }>('assert.ts', {
  alreadyLogged: new Set()
})

const logPrefix = `[${projectInfo.npmPackageName}@${projectInfo.projectVersion}]` as const
const internalErrorPrefix = `${logPrefix}[Bug]` as const
const usageErrorPrefix = `${logPrefix}[Wrong Usage]` as const
const warningPrefix = `${logPrefix}[Warning]` as const
const infoPrefix = `${logPrefix}[Info]` as const

const numberOfStackTraceLinesToRemove = 2

function assert(condition: unknown, debugInfo?: unknown): asserts condition {
  if (condition) {
    return
  }

  const debugStr = (() => {
    if (!debugInfo) {
      return null
    }
    const debugInfoSerialized = typeof debugInfo === 'string' ? debugInfo : '`' + JSON.stringify(debugInfo) + '`'
    return `Debug info (this is for the ${projectInfo.projectName} maintainers; you can ignore this): ${debugInfoSerialized}`
  })()

  const internalError = createErrorWithCleanStackTrace(
    [
      `${internalErrorPrefix} You stumbled upon a bug in ${projectInfo.projectName}'s source code.`,
      `Go to ${projectInfo.githubRepository}/issues/new and copy-paste this error. (The error's stack trace is usually enough to fix the problem).`,
      'A maintainer will fix the bug (usually under 24 hours).',
      `Don't hesitate to reach out as it makes ${projectInfo.projectName} more robust.`,
      debugStr
    ]
      .filter(Boolean)
      .join(' '),
    numberOfStackTraceLinesToRemove
  )

  globalObject.onBeforeLog?.()
  throw internalError
}

function assertUsage(condition: unknown, errorMessage: string): asserts condition {
  if (condition) {
    return
  }
  const whiteSpace = errorMessage.startsWith('[') ? '' : ' '
  const errMsg = `${usageErrorPrefix}${whiteSpace}${errorMessage}`
  const usageError = createErrorWithCleanStackTrace(errMsg, numberOfStackTraceLinesToRemove)
  globalObject.onBeforeLog?.()
  throw usageError
}

function getProjectError(errorMessage: string) {
  const sep = errorMessage.startsWith('[') ? '' : ' '
  const pluginError = createErrorWithCleanStackTrace(
    `${logPrefix}${sep}${errorMessage}`,
    numberOfStackTraceLinesToRemove
  )
  return pluginError
}

function assertWarning(
  condition: unknown,
  errorMessage: string,
  { onlyOnce = true, showStackTrace = false }: { onlyOnce?: boolean | string; showStackTrace?: boolean } = {}
): void {
  if (condition) {
    return
  }
  const msg = `${warningPrefix} ${errorMessage}`
  if (onlyOnce) {
    const { alreadyLogged } = globalObject
    const key = onlyOnce === true ? msg : onlyOnce
    if (alreadyLogged.has(key)) {
      return
    } else {
      alreadyLogged.add(key)
    }
  }
  globalObject.onBeforeLog?.()
  if (showStackTrace) {
    console.warn(new Error(msg))
  } else {
    console.warn(msg)
  }
}

function assertInfo(condition: unknown, errorMessage: string, { onlyOnce }: { onlyOnce: boolean }): void {
  if (condition) {
    return
  }
  const msg = `${infoPrefix} ${errorMessage}`
  if (onlyOnce) {
    const { alreadyLogged } = globalObject
    const key = msg
    if (alreadyLogged.has(key)) {
      return
    } else {
      alreadyLogged.add(key)
    }
  }
  globalObject.onBeforeLog?.()
  console.log(msg)
}

function addOnBeforeLogHook(onBeforeLog: () => void) {
  globalObject.onBeforeLog = onBeforeLog
}
