export { createDebug }
export { isDebug }
export { isDebugError }
export { debug }

import { isCallable } from './isCallable.js'
import { objectAssign } from './objectAssign.js'
import { assert, assertUsage } from './assert.js'
import { getTerminalWidth } from './getTerminalWidth.js'
import pc from '@brillout/picocolors'
import { isArray } from './isArray.js'
import { isObject } from './isObject.js'
const flags = [
  'vike',
  'vike:crawl',
  'vike:file-change',
  'vike:error',
  'vike:esbuild-resolve',
  'vike:pluginExtractAssets',
  'vike:pluginExtractExportNames',
  'vike:glob',
  'vike:globalContext',
  'vike:log',
  'vike:optimizeDeps',
  'vike:outDir',
  'vike:pageFiles',
  'vike:pointer-imports',
  'vike:requireResolve',
  'vike:routing',
  'vike:setup',
  'vike:staticReplace',
  'vike:stream',
  'vike:virtualFiles',
  'vike:vite-rpc',
] as const satisfies (`vike:${string}` | 'vike')[]
const flagsSkipWildcard = ['vike:log']

// Assert tree-shaking (ensure this module is loaded on the client-side only if debug is enabled).
const isUsed =
  !globalThis.__VIKE__IS_CLIENT ||
  globalThis.__VIKE__IS_DEBUG ||
  // Vite doesn't do tree-shaking in dev (maybe it will with Rolldown?)
  import.meta.env.DEV
// We purposely read process.env.DEBUG early, in order to avoid users from the temptation to set process.env.DEBUG with JavaScript, since reading & writing process.env.DEBUG dynamically leads to inconsistencies such as https://github.com/vikejs/vike/issues/2239
const DEBUG = (isUsed && getDEBUG()) || ''
if (isUsed) assertFlagsActivated()

type Flag = (typeof flags)[number]
type Options = {
  serialization?: {
    emptyArray?: string
  }
}

function createDebug(flag: Flag, optionsGlobal?: Options) {
  assert(flags.includes(flag))
  assert(isUsed)

  const debugWithOptions = (optionsLocal: Options) => {
    return (...msgs: unknown[]) => {
      const options = { ...optionsGlobal, ...optionsLocal }
      debug_(flag, options, ...msgs)
    }
  }
  const debug = (...msgs: unknown[]) => debugWithOptions({})(...msgs)
  objectAssign(debug, { options: debugWithOptions, isActivated: isDebug(flag) })
  return debug
}

function debug(flag: Flag, ...msgs: unknown[]) {
  return debug_(flag, {}, ...msgs)
}

function debug_(flag: Flag, options: Options, ...msgs: unknown[]) {
  assert(isUsed)
  if (!isDebug(flag)) return
  let [msgFirst, ...msgsRest] = msgs
  const padding = ' '.repeat(flag.length + 1)
  msgFirst = formatMsg(msgFirst, options, padding, 'FIRST')
  msgsRest = msgsRest.map((msg, i) => {
    const position = i === msgsRest.length - 1 ? 'LAST' : 'MIDDLE'
    return formatMsg(msg, options, padding, position)
  })
  let logFirst: unknown[]
  let logsRest: unknown[]
  const noNewLine =
    msgsRest.length <= 1 &&
    [msgFirst, ...msgsRest].every((m) => (typeof m === 'string' ? !m.includes('\n') : !isObject(m)))
  if (noNewLine) {
    logFirst = [msgFirst, ...msgsRest].map((m) => (typeof m !== 'string' ? m : m.trim()))
    logsRest = []
  } else {
    logFirst = [msgFirst]
    logsRest = msgsRest
  }
  console.log('\x1b[1m%s\x1b[0m', flag, ...logFirst)
  logsRest.forEach((msg) => {
    console.log(msg)
  })
}

function isDebug(flag?: Flag): boolean {
  assert(isUsed)
  assert(flag === undefined || (flag && flags.includes(flag)))
  const { flagsActivated, isAll, isGlobal } = getFlagsActivated()
  if (flag) {
    return flagsActivated.includes(flag) || (isAll && !flagsSkipWildcard.includes(flag))
  } else {
    return isAll || flagsActivated.length > 0 || isGlobal
  }
}
function isDebugError(): boolean {
  return isDebug('vike:error')
}

function formatMsg(
  info: unknown,
  options: Options,
  padding: string,
  position?: 'FIRST' | 'MIDDLE' | 'LAST',
): string | undefined {
  if (info === undefined) {
    return undefined
  }

  let str = position === 'FIRST' ? '' : padding

  if (typeof info === 'string') {
    str += info
  } else if (isArray(info)) {
    if (info.length === 0) {
      str += options.serialization?.emptyArray ?? '[]'
    } else {
      str += info.map(strUnknown).join('\n')
    }
  } else {
    str += strUnknown(info)
  }

  str = pad(str, padding)

  if (position !== 'LAST' && position !== 'FIRST') {
    str += '\n'
  }

  return str
}

function pad(str: string, padding: string): string {
  const terminalWidth = getTerminalWidth()
  const lines: string[] = []
  str.split('\n').forEach((line) => {
    if (!terminalWidth) {
      lines.push(line)
    } else {
      chunk(line, terminalWidth - padding.length).forEach((chunk) => {
        lines.push(chunk)
      })
    }
  })
  return lines.join('\n' + padding)
}
function chunk(str: string, size: number): string[] {
  if (str.length <= size) {
    return [str]
  }
  const chunks = str.match(new RegExp('.{1,' + size + '}', 'g'))
  assert(chunks)
  return chunks
}

function strUnknown(thing: unknown) {
  return typeof thing === 'string' ? thing : strObj(thing)
}
function strObj(obj: unknown, newLines = true) {
  return JSON.stringify(obj, replaceFunctionSerializer, newLines ? 2 : undefined)
}
function replaceFunctionSerializer(this: Record<string, unknown>, _key: string, value: unknown) {
  if (isCallable(value)) {
    return value.toString().split(/\s+/).join(' ')
  }
  return value
}

function assertFlagsActivated() {
  assert(isUsed)
  const { flagsActivated } = getFlagsActivated()
  flagsActivated.forEach((flag) => {
    assertUsage(
      (flags as readonly string[]).includes(flag),
      `Unknown DEBUG flag ${pc.cyan(flag)}. Valid flags:\n${flags.map((f) => `  ${pc.cyan(f)}`).join('\n')}`,
    )
  })
}

function getFlagsActivated() {
  const flagsActivated: string[] = DEBUG.match(/\bvike:[a-zA-Z-]+/g) ?? []
  const isAll = DEBUG.includes('vike:*')
  const isGlobal = /\bvike\b([^:]|$)/.test(DEBUG)
  return { flagsActivated, isAll, isGlobal }
}

function getDEBUG() {
  assert(isUsed)

  let DEBUG: undefined | string

  // ssr.noExternal
  //* // Full implementation:
  // - https://github.com/vikejs/vike/commit/7637564a98f43e23834bcae2f7ada8d941958a34
  // - https://github.com/vikejs/vike/pull/2718
  // - We don't implement this yet because it crashes @cloudflare/vite-plugin
  try {
    return import.meta.env.DEBUG
  } catch {}
  //*/

  // ssr.external
  // - `process` can be undefined in edge workers
  // - We want bundlers to be able to statically replace `process.env.*`
  try {
    DEBUG = process.env.DEBUG
  } catch {}

  return DEBUG
}
