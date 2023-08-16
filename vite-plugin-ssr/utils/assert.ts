export { assert }
export { assertUsage }
export { assertWarning }
export { assertInfo }
export { getProjectError }
export { addOnBeforeLogHook }
export { getAssertErrMsg }
export { overwriteAssertProductionLogger }
export { isBug }

import { createErrorWithCleanStackTrace } from './createErrorWithCleanStackTrace.js'
import { getGlobalObject } from './getGlobalObject.js'
import { isObject } from './isObject.js'
import { projectInfo } from './projectInfo.js'
import pc from '@brillout/picocolors'
const globalObject = getGlobalObject<{
  alreadyLogged: Set<string>
  onBeforeLog?: () => void
  logger: Logger
  showStackTraceList: WeakSet<Error>
}>('utils/assert.ts', {
  alreadyLogged: new Set(),
  // Production logger. Overwritten by loggerNotProd.ts in non-production environments.
  logger(msg, logType) {
    if (logType === 'info') {
      console.log(msg)
    } else {
      console.warn(msg)
    }
  },
  showStackTraceList: new WeakSet()
})
type Logger = (msg: string | Error, logType: 'warn' | 'info') => void

const projectTag = `[${projectInfo.npmPackageName}]` as const
const projectTagWithVersion = `[${projectInfo.npmPackageName}@${projectInfo.projectVersion}]` as const

const numberOfStackTraceLinesToRemove = 2

function assert(condition: unknown, debugInfo?: unknown): asserts condition {
  if (condition) return

  const debugStr = (() => {
    if (!debugInfo) {
      return null
    }
    const debugInfoSerialized = typeof debugInfo === 'string' ? debugInfo : '`' + JSON.stringify(debugInfo) + '`'
    return `Debug info (this is for the ${projectInfo.projectName} maintainers; you can ignore this): ${debugInfoSerialized}`
  })()

  let errMsg = [
    `You stumbled upon a bug in ${projectInfo.projectName}'s source code.`,
    `Go to ${projectInfo.githubRepository}/issues/new and copy-paste this error; a maintainer will fix the bug (usually under 24 hours).`,
    debugStr
  ]
    .filter(Boolean)
    .join(' ')
  errMsg = addWhitespace(errMsg)
  errMsg = addPrefixAssertType(errMsg, 'Bug')
  errMsg = addPrefixProjctName(errMsg, true)
  const internalError = createErrorWithCleanStackTrace(errMsg, numberOfStackTraceLinesToRemove)

  globalObject.onBeforeLog?.()
  throw internalError
}

function assertUsage(
  condition: unknown,
  errMsg: string,
  { showStackTrace }: { showStackTrace?: true } = {}
): asserts condition {
  if (condition) return
  errMsg = addWhitespace(errMsg)
  errMsg = addPrefixAssertType(errMsg, 'Wrong Usage')
  errMsg = addPrefixProjctName(errMsg)
  const usageError = createErrorWithCleanStackTrace(errMsg, numberOfStackTraceLinesToRemove)
  if (showStackTrace) {
    globalObject.showStackTraceList.add(usageError)
  }
  globalObject.onBeforeLog?.()
  throw usageError
}

function getProjectError(errMsg: string) {
  errMsg = addWhitespace(errMsg)
  errMsg = addPrefixAssertType(errMsg, 'Error')
  errMsg = addPrefixProjctName(errMsg)
  const projectError = createErrorWithCleanStackTrace(errMsg, numberOfStackTraceLinesToRemove)
  return projectError
}

function assertWarning(
  condition: unknown,
  msg: string,
  { onlyOnce, showStackTrace }: { onlyOnce: boolean | string; showStackTrace?: true }
): void {
  if (condition) return
  msg = addWhitespace(msg)
  msg = addPrefixAssertType(msg, 'Warning')
  msg = addPrefixProjctName(msg)
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
    const err = new Error(msg)
    globalObject.showStackTraceList.add(err)
    globalObject.logger(err, 'warn')
  } else {
    globalObject.logger(msg, 'warn')
  }
}

function assertInfo(condition: unknown, msg: string, { onlyOnce }: { onlyOnce: boolean }): void {
  if (condition) {
    return
  }
  msg = addWhitespace(msg)
  msg = addPrefixProjctName(msg)
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

type Tag = 'Bug' | 'Wrong Usage' | 'Error' | 'Warning'
function addPrefixAssertType(msg: string, tag: Tag): string {
  let prefix = `[${tag}]`
  const color = tag === 'Warning' ? 'yellow' : 'red'
  prefix = pc.bold(pc[color](prefix))
  return `${prefix}${msg}`
}
function addWhitespace(msg: string) {
  if (msg.startsWith('[')) {
    return msg
  } else {
    return ` ${msg}`
  }
}
function addPrefixProjctName(msg: string, showProjectVersion = false): string {
  const prefix = showProjectVersion ? projectTagWithVersion : projectTag
  return `${prefix}${msg}`
}

function getAssertErrMsg(thing: unknown): { assertMsg: string; showVikeVersion: boolean } | null {
  let errMsg: string
  let errStack: null | string = null
  if (typeof thing === 'string') {
    errMsg = thing
  } else if (isObject(thing) && typeof thing.message === 'string' && typeof thing.stack === 'string') {
    errMsg = thing.message
    errStack = thing.stack
  } else {
    return null
  }

  let assertMsg: string
  let isBug: boolean
  if (errMsg.startsWith(projectTag)) {
    assertMsg = errMsg.slice(projectTag.length)
    isBug = false
  } else if (errMsg.startsWith(projectTagWithVersion)) {
    assertMsg = errMsg.slice(projectTagWithVersion.length)
    isBug = true
  } else {
    return null
  }

  // Append stack trace
  if (errStack && (isBug || globalObject.showStackTraceList.has(thing as any))) {
    assertMsg = `${assertMsg}\n${removeErrMsg(errStack)}`
  }

  const showVikeVersion = isBug
  return { assertMsg, showVikeVersion }
}

function removeErrMsg(stack: unknown): string {
  if (typeof stack !== 'string') return String(stack)
  const [firstLine, ...stackLines] = stack.split('\n')
  if (!firstLine!.startsWith('Error: ')) return stack
  return stackLines.join('\n')
}

function overwriteAssertProductionLogger(logger: Logger): void {
  globalObject.logger = logger
}

function isBug(err: unknown): boolean {
  return !String(err).includes('[Bug]')
}
