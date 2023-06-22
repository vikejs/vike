export { assert }
export { assertUsage }
export { assertWarning }
export { assertInfo }
export { getProjectError }
export { addOnBeforeLogHook }
export { assertHasLogged }
export { getAssertErrMsg }
export { addAssertColorer }
export { overwriteAssertProductionLogger }

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
  // Production logger
  logger(msg, logType) {
    if (logType === 'info') {
      console.log(msg)
    } else {
      console.warn(msg)
    }
  },
  // No colors in production
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
    `Go to ${projectInfo.githubRepository}/issues/new and copy-paste this error; a maintainer will fix the bug (usually under 24 hours).`,
    debugStr
  ]
    .filter(Boolean)
    .join(' ')
  errMsg = addPrefixAssertType(errMsg, 'Bug')
  errMsg = addPrefixProjctName(errMsg, true)
  const internalError = createErrorWithCleanStackTrace(errMsg, numberOfStackTraceLinesToRemove)

  globalObject.onBeforeLog?.()
  throw internalError
}

function assertUsage(condition: unknown, errMsg: string): asserts condition {
  if (condition) return
  globalObject.hasLogged = true
  errMsg = addPrefixAssertType(errMsg, 'Wrong Usage')
  errMsg = addPrefixProjctName(errMsg)
  const usageError = createErrorWithCleanStackTrace(errMsg, numberOfStackTraceLinesToRemove)
  globalObject.onBeforeLog?.()
  throw usageError
}

function getProjectError(errMsg: string) {
  errMsg = addPrefixAssertType(errMsg, 'Error')
  errMsg = addPrefixProjctName(errMsg)
  const projectError = createErrorWithCleanStackTrace(errMsg, numberOfStackTraceLinesToRemove)
  return projectError
}

function assertWarning(
  condition: unknown,
  msg: string,
  { onlyOnce = true, showStackTrace = false }: { onlyOnce?: boolean | string; showStackTrace?: boolean } = {}
): void {
  if (condition) return
  globalObject.hasLogged = true
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
    globalObject.logger(new Error(msg), 'warn')
  } else {
    globalObject.logger(msg, 'warn')
  }
}

function assertInfo(condition: unknown, msg: string, { onlyOnce }: { onlyOnce: boolean }): void {
  if (condition) {
    return
  }
  msg = addPrefixAssertType(msg, 'Info')
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

function assertHasLogged(): boolean {
  return !!globalObject.hasLogged
}

type Tag = 'Bug' | 'Wrong Usage' | 'Error' | 'Warning' | 'Info'
function addPrefixAssertType(msg: string, tag: Tag): string {
  let prefix = `[${tag}]`
  const color = tag === 'Info' ? 'blue' : tag === 'Warning' ? 'yellow' : 'red'
  prefix = globalObject.colorer(prefix, color)
  const whitespace = msg.startsWith('[') ? '' : ' '
  return `${prefix}${whitespace}${msg}`
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
  let assertMsg = errMsg
  if (assertMsg.startsWith(projectTag)) {
    assertMsg = assertMsg.slice(projectTag.length)
    return { assertMsg, showVikeVersion: false }
  }
  if (assertMsg.startsWith(projectTagWithVersion)) {
    assertMsg = assertMsg.slice(projectTagWithVersion.length)
    // Apppend stack trace for [Bug]
    if (errStack) {
      assertMsg = `${assertMsg}\n${removeErrMsg(errStack)}`
    }
    return { assertMsg, showVikeVersion: true }
  }
  return null
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
function addAssertColorer(colorer: Colorer): void {
  globalObject.colorer = colorer
}
