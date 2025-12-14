export { assert }
export { assertUsage }
export { assertWarning }
export { assertInfo }
export { getProjectError }
export { isVikeBug }
export { setAssertOnBeforeLog }
export { setAssertOnBeforeErr }
export { setAlwaysShowStackTrace }

import { assertSingleInstance_onAssertModuleLoad } from './assertSingleInstance.js'
import { createErrorWithCleanStackTrace } from './createErrorWithCleanStackTrace.js'
import { getGlobalObject } from './getGlobalObject.js'
import { PROJECT_VERSION } from './PROJECT_VERSION.js'
import { colorVike, colorWarning, colorError } from './colorsClient.js'
import pc from '@brillout/picocolors'
const globalObject = getGlobalObject<{
  alreadyLogged: Set<string>
  onBeforeLog?: () => void
  onBeforeErr?: (err: Error) => void
  alwaysShowStackTrace?: true
}>('utils/assert.ts', {
  alreadyLogged: new Set(),
})
assertSingleInstance_onAssertModuleLoad()

const tagVike = `[vike]` as const
const tagVikeWithVersion = `[vike@${PROJECT_VERSION}]` as const
const tagTypeBug = 'Bug'
type TagType = 'Bug' | 'Wrong Usage' | 'Error' | 'Warning'

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
  errMsg = addTags(errMsg, tagTypeBug, true)
  const internalError = createErrorWithCleanStackTrace(errMsg, numberOfStackTraceLinesToRemove)

  globalObject.onBeforeLog?.()
  globalObject.onBeforeErr?.(internalError)
  throw internalError
}

function assertUsage(
  condition: unknown,
  errMsg: string,
  { showStackTrace, exitOnError }: { showStackTrace?: true; exitOnError?: boolean } = {},
): asserts condition {
  if (condition) return
  showStackTrace = showStackTrace || globalObject.alwaysShowStackTrace
  errMsg = addTags(errMsg, 'Wrong Usage')
  const usageError = createErrorWithCleanStackTrace(errMsg, numberOfStackTraceLinesToRemove)
  globalObject.onBeforeLog?.()
  globalObject.onBeforeErr?.(usageError)
  if (!exitOnError) {
    throw usageError
  } else {
    console.error(showStackTrace ? usageError : errMsg)
    process.exit(1)
  }
}

function getProjectError(errMsg: string) {
  errMsg = addTags(errMsg, 'Error')
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
  msg = addTags(msg, 'Warning')
  if (onlyOnce) {
    const { alreadyLogged } = globalObject
    const key = onlyOnce === true ? msg : onlyOnce
    if (alreadyLogged.has(key)) return
    alreadyLogged.add(key)
  }
  globalObject.onBeforeLog?.()
  if (showStackTrace) {
    const err = createErrorWithCleanStackTrace(msg, numberOfStackTraceLinesToRemove)
    globalObject.onBeforeErr?.(err)
    console.warn(err)
  } else {
    console.warn(msg)
  }
}

function assertInfo(condition: unknown, msg: string, { onlyOnce }: { onlyOnce: boolean }): void {
  if (condition) {
    return
  }
  msg = addTags(msg, null)
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

function setAssertOnBeforeLog(onBeforeAssertLog: () => void) {
  globalObject.onBeforeLog = onBeforeAssertLog
}
function setAssertOnBeforeErr(onBeforeAssertErr: (err: unknown) => void) {
  globalObject.onBeforeErr = onBeforeAssertErr
}

function addTags(msg: string, tagType: TagType | null, showProjectVersion = false) {
  const tags = `${getTagVike(showProjectVersion)}${getTagType(tagType)}` as const
  msg = addTagWhitespace(msg)
  msg = tags + msg
  return msg
}
function addTagWhitespace(msg: string) {
  if (msg.startsWith('[')) {
    return msg
  } else {
    return ` ${msg}`
  }
}
function getTagType(tagType: TagType | null) {
  if (!tagType) return ''
  let tag = `[${tagType}]` as const
  if (tagType === 'Warning') {
    tag = colorWarning(tag)
  } else {
    tag = colorError(tag)
  }
  return tag
}
function getTagVike(showProjectVersion = false) {
  const tag = showProjectVersion ? tagVikeWithVersion : tagVike
  return colorVike(tag)
}

function isVikeBug(err: unknown): boolean {
  return String(err).includes(`[${tagTypeBug}]`)
}

// Called upon `DEBUG=vike:error`
function setAlwaysShowStackTrace() {
  globalObject.alwaysShowStackTrace = true
}
