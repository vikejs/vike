export { assert }
export { assertUsage }
export { assertWarning }
export { assertInfo }
export { getProjectError }
export { addOnBeforeAssertLog }
export { addOnBeforeAssertErr }
export { isVikeBug }
export { setAlwaysShowStackTrace }

import { assertSingleInstance_onAssertModuleLoad } from './assertSingleInstance.js'
import { createErrorWithCleanStackTrace } from './createErrorWithCleanStackTrace.js'
import { getGlobalObject } from './getGlobalObject.js'
import { PROJECT_VERSION } from './PROJECT_VERSION.js'
import { colorVike } from './colorVike.js'
import pc from '@brillout/picocolors'
const globalObject = getGlobalObject<{
  alreadyLogged: Set<string>
  onBeforeAssertLog?: () => void
  onBeforeAssertErr?: (err: Error) => void
  alwaysShowStackTrace?: true
}>('utils/assert.ts', {
  alreadyLogged: new Set(),
})
assertSingleInstance_onAssertModuleLoad()

const tagVike = `[vike]` as const
const tagVikeWithVersion = `[vike@${PROJECT_VERSION}]` as const
const tagAssertBug = 'Bug'
type Tag = 'Bug' | 'Wrong Usage' | 'Error' | 'Warning'

const numberOfStackTraceLinesToRemove = 2

function assert(condition: unknown, debugInfo?: unknown): asserts condition {
  if (condition) return

  const debugStr = (() => {
    if (!debugInfo) {
      return null
    }
    const debugInfoSerialized = typeof debugInfo === 'string' ? debugInfo : JSON.stringify(debugInfo)
    return pc.dim(`Debug for maintainers (you can ignore this): ${debugInfoSerialized}`)
  })()

  const link = pc.underline('https://github.com/vikejs/vike/issues/new?template=bug.yml')
  let errMsg = [
    `You stumbled upon a Vike bug. Go to ${link} and copy-paste this error. A maintainer will fix the bug (usually within 24 hours).`,
    debugStr,
  ]
    .filter(Boolean)
    .join(' ')
  errMsg = addWhitespace(errMsg)
  errMsg = addTagAssert(errMsg, tagAssertBug)
  errMsg = addTagVike(errMsg, true)
  const internalError = createErrorWithCleanStackTrace(errMsg, numberOfStackTraceLinesToRemove)

  globalObject.onBeforeAssertLog?.()
  globalObject.onBeforeAssertErr?.(internalError)
  throw internalError
}

function assertUsage(
  condition: unknown,
  errMsg: string,
  { showStackTrace, exitOnError }: { showStackTrace?: true; exitOnError?: boolean } = {},
): asserts condition {
  if (condition) return
  showStackTrace = showStackTrace || globalObject.alwaysShowStackTrace
  errMsg = addWhitespace(errMsg)
  errMsg = addTagAssert(errMsg, 'Wrong Usage')
  errMsg = addTagVike(errMsg)
  const usageError = createErrorWithCleanStackTrace(errMsg, numberOfStackTraceLinesToRemove)
  globalObject.onBeforeAssertLog?.()
  globalObject.onBeforeAssertErr?.(usageError)
  if (!exitOnError) {
    throw usageError
  } else {
    console.error(showStackTrace ? usageError : errMsg)
    process.exit(1)
  }
}

function getProjectError(errMsg: string) {
  errMsg = addWhitespace(errMsg)
  errMsg = addTagAssert(errMsg, 'Error')
  errMsg = addTagVike(errMsg)
  const projectError = createErrorWithCleanStackTrace(errMsg, numberOfStackTraceLinesToRemove)
  return projectError
}

function assertWarning(
  condition: unknown,
  msg: string,
  { onlyOnce, showStackTrace }: { onlyOnce: boolean | string; showStackTrace?: true },
): void {
  if (condition) return
  showStackTrace = showStackTrace || globalObject.alwaysShowStackTrace
  msg = addWhitespace(msg)
  msg = addTagAssert(msg, 'Warning')
  msg = addTagVike(msg)
  if (onlyOnce) {
    const { alreadyLogged } = globalObject
    const key = onlyOnce === true ? msg : onlyOnce
    if (alreadyLogged.has(key)) return
    alreadyLogged.add(key)
  }
  globalObject.onBeforeAssertLog?.()
  if (showStackTrace) {
    const err = createErrorWithCleanStackTrace(msg, numberOfStackTraceLinesToRemove)
    globalObject.onBeforeAssertErr?.(err)
    console.warn(err)
  } else {
    console.warn(msg)
  }
}

function assertInfo(condition: unknown, msg: string, { onlyOnce }: { onlyOnce: boolean }): void {
  if (condition) {
    return
  }
  msg = addWhitespace(msg)
  msg = addTagVike(msg)
  if (onlyOnce) {
    const { alreadyLogged } = globalObject
    const key = msg
    if (alreadyLogged.has(key)) {
      return
    } else {
      alreadyLogged.add(key)
    }
  }
  globalObject.onBeforeAssertLog?.()
  console.log(msg)
}

function addOnBeforeAssertLog(onBeforeAssertLog: () => void) {
  globalObject.onBeforeAssertLog = onBeforeAssertLog
}
function addOnBeforeAssertErr(onBeforeAssertErr: (err: unknown) => void) {
  globalObject.onBeforeAssertErr = onBeforeAssertErr
}

function addTagAssert(msg: string, tagAssert: Tag): string {
  let tag = `[${tagAssert}]`
  if (tagAssert === 'Warning') {
    tag = pc.yellow(tag)
  } else {
    tag = pc.bold(pc.red(tag))
  }
  return `${tag}${msg}`
}
function addWhitespace(msg: string) {
  if (msg.startsWith('[')) {
    return msg
  } else {
    return ` ${msg}`
  }
}
function addTagVike(msg: string, showProjectVersion = false): string {
  const tag = showProjectVersion ? tagVikeWithVersion : tagVike
  return `${colorVike(tag)}${msg}`
}

function isVikeBug(err: unknown): boolean {
  return String(err).includes(`[${tagAssertBug}]`)
}

// Called upon `DEBUG=vike:error`
function setAlwaysShowStackTrace() {
  globalObject.alwaysShowStackTrace = true
}
