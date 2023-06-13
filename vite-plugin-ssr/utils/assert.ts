export { assert }
export { assertUsage }
export { assertWarning }
export { assertInfo }
export { getProjectError }
export { addOnBeforeLogHook }
export { assertHasLogged }
export { getAssertMsg }

import { createErrorWithCleanStackTrace } from './createErrorWithCleanStackTrace'
import { getGlobalObject } from './getGlobalObject'
import { isObject } from './isObject'
import { projectInfo } from './projectInfo'
const globalObject = getGlobalObject<{
  alreadyLogged: Set<string>
  onBeforeLog?: () => void
  hasLogged?: true
}>('utils/assert.ts', { alreadyLogged: new Set() })

const logPrefix = `[${projectInfo.npmPackageName}]` as const
const logPrefixBug = `[${projectInfo.npmPackageName}@${projectInfo.projectVersion}]` as const
const internalErrorPrefix = `${logPrefixBug}[Bug]` as const
const usageErrorPrefix = `${logPrefix}[Wrong Usage]` as const
const errorPrefix = `${logPrefix}[Error]` as const
const warningPrefix = `${logPrefix}[Warning]` as const
const infoPrefix = `${logPrefix}[Info]` as const

const numberOfStackTraceLinesToRemove = 2

function assert(condition: unknown, debugInfo?: unknown): asserts condition {
  if (condition) return
  globalObject.hasLogged = true

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

function assertUsage(condition: unknown, errMsg: string): asserts condition {
  if (condition) return
  globalObject.hasLogged = true
  errMsg = addPrefix(usageErrorPrefix, errMsg)
  const usageError = createErrorWithCleanStackTrace(errMsg, numberOfStackTraceLinesToRemove)
  globalObject.onBeforeLog?.()
  throw usageError
}

function getProjectError(errMsg: string) {
  errMsg = addPrefix(errorPrefix, errMsg)
  const projectError = createErrorWithCleanStackTrace(errMsg, numberOfStackTraceLinesToRemove)
  return projectError
}

function assertWarning(
  condition: unknown,
  warnMsg: string,
  { onlyOnce = true, showStackTrace = false }: { onlyOnce?: boolean | string; showStackTrace?: boolean } = {}
): void {
  if (condition) return
  globalObject.hasLogged = true
  warnMsg = addPrefix(warningPrefix, warnMsg)
  if (onlyOnce) {
    const { alreadyLogged } = globalObject
    const key = onlyOnce === true ? warnMsg : onlyOnce
    if (alreadyLogged.has(key)) {
      return
    } else {
      alreadyLogged.add(key)
    }
  }
  globalObject.onBeforeLog?.()
  if (showStackTrace) {
    console.warn(new Error(warnMsg))
  } else {
    console.warn(warnMsg)
  }
}

function assertInfo(condition: unknown, msg: string, { onlyOnce }: { onlyOnce: boolean }): void {
  if (condition) {
    return
  }
  msg = addPrefix(infoPrefix, msg)
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

function assertHasLogged(): boolean {
  return !!globalObject.hasLogged
}

function addPrefix(prefix: `[vite-plugin-ssr][${string}]`, msg: string) {
  const whitespace = msg.startsWith('[') ? '' : ' '
  return `${prefix}${whitespace}${msg}`
}

function getAssertMsg(err: unknown): { assertMsg: string; logType: 'error' | 'warn' | 'info' } | null {
  if (!isObject(err) || typeof err.message !== 'string') return null
  const errMsg = err.message
  if (errMsg.startsWith(internalErrorPrefix)) {
    let assertMsg = errMsg.slice(logPrefix.length)
    assertMsg = `${assertMsg}\n${err.stack}`
    return { assertMsg, logType: 'error' }
  }
  if (errMsg.startsWith(logPrefix)) {
    let assertMsg = errMsg.slice(logPrefix.length)
    const logType = (() => {
      if (errMsg.startsWith(infoPrefix)) return 'info' as const
      if (errMsg.startsWith(warningPrefix)) return 'warn' as const
      if (errMsg.startsWith(errorPrefix)) return 'error' as const
      if (errMsg.startsWith(usageErrorPrefix)) return 'error' as const
      return 'info' as const
    })()
    return { assertMsg, logType }
  }
  return null
}
