export { assert }
export { assertUsage }
export { assertWarning }
export { assertInfo }
export { getProjectError }
export { addOnBeforeLogHook }
export { getAssertErrMsg }
export { overwriteAssertProductionLogger }
export { isBug }
export { setAlwaysShowStackTrace }

import { assertSingleInstance_onAssertModuleLoad } from './assertSingleInstance.js'
import { createErrorWithCleanStackTrace } from './createErrorWithCleanStackTrace.js'
import { getGlobalObject } from './getGlobalObject.js'
import { isObject } from './isObject.js'
import { PROJECT_VERSION } from './PROJECT_VERSION.js'
import pc from '@brillout/picocolors'
const globalObject = getGlobalObject<{
  alreadyLogged: Set<string>
  onBeforeLog?: () => void
  logger: Logger
  showStackTraceList: WeakSet<Error>
  alwaysShowStackTrace?: true
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
  showStackTraceList: new WeakSet(),
})
type Logger = (msg: string | Error, logType: 'warn' | 'info') => void
assertSingleInstance_onAssertModuleLoad()

const projectTag = `[vike]` as const
const projectTagWithVersion = `[vike@${PROJECT_VERSION}]` as const
const bugTag = 'Bug'
type Tag = 'Bug' | 'Wrong Usage' | 'Error' | 'Warning'

const numberOfStackTraceLinesToRemove = 2

function assert(condition: unknown, debugInfo?: unknown): asserts condition {
  if (condition) return

  const debugStr = (() => {
    if (!debugInfo) {
      return null
    }
    const debugInfoSerialized = typeof debugInfo === 'string' ? debugInfo : JSON.stringify(debugInfo)
    return pc.dim(`Debug info for Vike maintainers (you can ignore this): ${debugInfoSerialized}`)
  })()

  const link = pc.underline('https://github.com/vikejs/vike/issues/new?template=bug.yml')
  let errMsg = [
    `You stumbled upon a Vike bug. Go to ${link} and copy-paste this error. A maintainer will fix the bug (usually within 24 hours).`,
    debugStr,
  ]
    .filter(Boolean)
    .join(' ')
  errMsg = addWhitespace(errMsg)
  errMsg = addPrefixAssertType(errMsg, bugTag)
  errMsg = addPrefixProjectName(errMsg, true)
  const internalError = createErrorWithCleanStackTrace(errMsg, numberOfStackTraceLinesToRemove)

  globalObject.onBeforeLog?.()
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
  errMsg = addPrefixAssertType(errMsg, 'Wrong Usage')
  errMsg = addPrefixProjectName(errMsg)
  const usageError = createErrorWithCleanStackTrace(errMsg, numberOfStackTraceLinesToRemove)
  if (showStackTrace) {
    globalObject.showStackTraceList.add(usageError)
  }
  globalObject.onBeforeLog?.()
  if (!exitOnError) {
    throw usageError
  } else {
    console.error(showStackTrace ? usageError : errMsg)
    process.exit(1)
  }
}

function getProjectError(errMsg: string) {
  errMsg = addWhitespace(errMsg)
  errMsg = addPrefixAssertType(errMsg, 'Error')
  errMsg = addPrefixProjectName(errMsg)
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
  msg = addPrefixAssertType(msg, 'Warning')
  msg = addPrefixProjectName(msg)
  if (onlyOnce) {
    const { alreadyLogged } = globalObject
    const key = onlyOnce === true ? msg : onlyOnce
    if (alreadyLogged.has(key)) return
    alreadyLogged.add(key)
  }
  globalObject.onBeforeLog?.()
  if (showStackTrace) {
    const err = createErrorWithCleanStackTrace(msg, numberOfStackTraceLinesToRemove)
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
  msg = addPrefixProjectName(msg)
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
function addPrefixProjectName(msg: string, showProjectVersion = false): string {
  const prefix = showProjectVersion ? projectTagWithVersion : projectTag
  return `${prefix}${msg}`
}

// TO-DO/eventually: remove this (refactor the whole log handling)
function getAssertErrMsg(thing: unknown): { assertMsg: string; showVikeVersion: boolean } | null {
  let errMsg: string
  let errStack: string | undefined
  if (typeof thing === 'string') {
    errMsg = thing
  } else if (isObject(thing) && typeof thing.message === 'string' && typeof thing.stack === 'string') {
    errMsg = thing.message
    errStack = thing.stack
  } else {
    return null
  }

  for (const tag of [projectTagWithVersion, projectTag]) {
    const showVikeVersion = tag === projectTagWithVersion
    const errStackPrefix = `Error: ${tag}`
    if (errStack?.startsWith(errStackPrefix)) {
      if (globalObject.showStackTraceList.has(thing as any) || isBug(thing)) {
        const assertMsg = errStack.slice(errStackPrefix.length)
        return { assertMsg, showVikeVersion }
      }
    } else if (errStack?.includes(tag)) {
      // The following assert can fail, e.g. with following error:
      // ```
      // Error: Error running module "/home/rom/code/vike-server/examples/cloudflare-react/cloudflare-entry.js".
      // Error running module "photon:cloudflare:/home/rom/code/vike-server/examples/cloudflare-react/server.js".
      // Error running module "/home/rom/code/vike-server/examples/cloudflare-react/server.js".
      // Error running module "/home/rom/code/vike-server/node_modules/.pnpm/@photonjs+hono@0.0.6_@hattip+core@0.0.49_elysia@1.3.13_exact-mirror@0.1.6_@sinclair+typ_c39d432d43266746f390ace81b426601/node_modules/@photonjs/hono/dist/index.js?v=6ca51a04".
      // Error running module "/home/rom/code/vike-server/node_modules/.pnpm/@photonjs+hono@0.0.6_@hattip+core@0.0.49_elysia@1.3.13_exact-mirror@0.1.6_@sinclair+typ_c39d432d43266746f390ace81b426601/node_modules/@photonjs/hono/dist/apply.dev.js?v=6ca51a04".
      // Error running module "photon:get-middlewares:dev:hono".
      // Error running module "/home/rom/code/vike-server/packages/vike-server/dist/universal.dev.js".
      // [vike][Wrong Usage] The global context isn't set yet, use getGlobalContextAsync() instead........
      //     at async ProxyServer.fetch (file:///home/rom/code/vike-server/node_modules/.pnpm/miniflare@4.20250829.0/node_modules/miniflare/src/workers/core/proxy.worker.ts:174:11)
      // ```
      /*
      throw new Error('Internal Vike error')
      */
    }
    if (errMsg?.startsWith(tag)) {
      const assertMsg = errMsg.slice(tag.length)
      return { assertMsg, showVikeVersion }
    }
  }
  return null
}

function overwriteAssertProductionLogger(logger: Logger): void {
  globalObject.logger = logger
}

function isBug(err: unknown): boolean {
  return String(err).includes(`[${bugTag}]`)
}

// Called upon `DEBUG=vike:error`
function setAlwaysShowStackTrace() {
  globalObject.alwaysShowStackTrace = true
}
