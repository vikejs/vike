export { assert }
export { assertUsage }
export { assertWarning }
export { assertInfo }
export { getProjectError }
export { addOnBeforeLogHook }
export { assertHasLogged }
export { getAssertErrMsg }
export { setAssertLogger }
export { setAssertColorer }

import { createErrorWithCleanStackTrace } from './createErrorWithCleanStackTrace'
import { getGlobalObject } from './getGlobalObject'
import { isObject } from './isObject'
import { projectInfo } from './projectInfo'
const globalObject = getGlobalObject<{
  alreadyLogged: Set<string>
  onBeforeLog?: () => void
  hasLogged?: true
  logger: Logger
  colorer: Colorer
}>('utils/assert.ts', {
  alreadyLogged: new Set(),
  logger(msg, logType) {
    if (logType === 'info') {
      console.log(msg)
    }
    if (logType === 'warn') {
      console.warn(msg)
      return
    }
    assert(false)
  },
  colorer: (str) => str
})
type Logger = (msg: string | Error, logType: 'warn' | 'info') => void
type Colorer = (str: string, color: 'red' | 'blue' | 'yellow') => string

const projectTag = `[${projectInfo.npmPackageName}]` as const
const projectTagWithVersion = `[${projectInfo.npmPackageName}@${projectInfo.projectVersion}]` as const

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

  let errMsg = [
    `You stumbled upon a bug in ${projectInfo.projectName}'s source code.`,
    `Go to ${projectInfo.githubRepository}/issues/new and copy-paste this error. (The error's stack trace is usually enough to fix the problem).`,
    'A maintainer will fix the bug (usually under 24 hours).',
    `Don't hesitate to reach out as it makes ${projectInfo.projectName} more robust.`,
    debugStr
  ]
    .filter(Boolean)
    .join(' ')
  errMsg = addPrefix('Bug', errMsg)
  const internalError = createErrorWithCleanStackTrace(errMsg, numberOfStackTraceLinesToRemove)

  globalObject.onBeforeLog?.()
  throw internalError
}

function assertUsage(condition: unknown, errMsg: string): asserts condition {
  if (condition) return
  globalObject.hasLogged = true
  errMsg = addPrefix('Wrong usage', errMsg)
  const usageError = createErrorWithCleanStackTrace(errMsg, numberOfStackTraceLinesToRemove)
  globalObject.onBeforeLog?.()
  throw usageError
}

function getProjectError(errMsg: string) {
  errMsg = addPrefix('Error', errMsg)
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
  warnMsg = addPrefix('Warning', warnMsg)
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
    globalObject.logger(new Error(warnMsg), 'warn')
  } else {
    globalObject.logger(warnMsg, 'warn')
  }
}

function assertInfo(condition: unknown, msg: string, { onlyOnce }: { onlyOnce: boolean }): void {
  if (condition) {
    return
  }
  msg = addPrefix('Info', msg)
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
  globalObject.logger(msg, 'info')
}

function addOnBeforeLogHook(onBeforeLog: () => void) {
  globalObject.onBeforeLog = onBeforeLog
}

function assertHasLogged(): boolean {
  return !!globalObject.hasLogged
}

type Tag = 'Bug' | 'Wrong usage' | 'Error' | 'Warning' | 'Info'
function addPrefix(tag: Tag, msg: string) {
  let prefix = `[${tag}]`
  const color = tag === 'Info' ? 'blue' : tag === 'Warning' ? 'yellow' : 'red'
  prefix = globalObject.colorer(prefix, color)
  prefix = `${tag === 'Bug' ? projectTagWithVersion : projectTag}${prefix}`
  assert(!/\s/.test(msg[0]!))
  const whitespace = msg.startsWith('[') ? '' : ' '
  return `${prefix}${whitespace}${msg}`
}

function getAssertErrMsg(err: unknown): string | null {
  if (!isObject(err) || typeof err.message !== 'string') return null
  let assertMsg = err.message
  if (assertMsg.startsWith(projectTag)) {
    assertMsg = assertMsg.slice(projectTag.length)
    return assertMsg
  }
  if (assertMsg.startsWith(projectTagWithVersion)) {
    assertMsg = assertMsg.slice(projectTagWithVersion.length)
    assertMsg = `${assertMsg}\n${err.stack}`
    return assertMsg
  }
  return null
}

function setAssertLogger(logger: Logger): void {
  globalObject.logger = logger
}
function setAssertColorer(colorer: Colorer): void {
  globalObject.colorer = colorer
}
