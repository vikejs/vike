export { createDebugger }
export { isDebugActivated }
export type { Debug }

import { isBrowser } from './isBrowser.js'
import { isCallable } from './isCallable.js'
import { objectAssign } from './objectAssign.js'
import { assert, assertUsage } from './assert.js'
import { checkType } from './checkType.js'
import { getTerminalWidth } from './getTerminWidth.js'
import pc from '@brillout/picocolors'
import { isArray } from './isArray.js'
import { isObject } from './isObject.js'
import { setCreateDebugger } from '../shared/route/debug.js'

assert(!isBrowser())
setCreateDebugger(createDebugger) // for isomorphic code

const flags = [
  'vike:crawl',
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
  'vike:resolve',
  'vike:routing',
  'vike:setup',
  'vike:stream',
  'vike:virtualFiles'
] as const
const flagsSkipWildcard = ['vike:log']
const flagRegex = /\bvike:[a-zA-Z-]+/g
// We purposely read process.env.DEBUG early, in order to avoid users from the temptation to set process.env.DEBUG with JavaScript, since reading & writing process.env.DEBUG dynamically leads to inconsistencies such as https://github.com/vikejs/vike/issues/2239
const DEBUG = getDEBUG() ?? ''
if (isDebug()) Error.stackTraceLimit = Infinity
assertFlagsActivated()

type Flag = (typeof flags)[number]
type Debug = ReturnType<typeof createDebugger>
type Options = {
  serialization?: {
    emptyArray?: string
  }
}

function createDebugger(flag: Flag, optionsGlobal?: Options) {
  checkType<`vike:${string}`>(flag)
  assert(flags.includes(flag))

  const debugWithOptions = (optionsLocal: Options) => {
    return (...msgs: unknown[]) => {
      const options = { ...optionsGlobal, ...optionsLocal }
      debug_(flag, options, ...msgs)
    }
  }
  const debug = (...msgs: unknown[]) => debugWithOptions({})(...msgs)
  objectAssign(debug, { options: debugWithOptions, isActivated: isDebugActivated(flag) })
  return debug
}

function debug_(flag: Flag, options: Options, ...msgs: unknown[]) {
  if (!isDebugActivated(flag)) return
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

function isDebugActivated(flag: Flag): boolean {
  checkType<`vike:${string}`>(flag)
  assert(flags.includes(flag))
  const { flagsActivated, all } = getFlagsActivated()
  const isActivated = flagsActivated.includes(flag) || (all && !flagsSkipWildcard.includes(flag))
  return isActivated
}

function formatMsg(
  info: unknown,
  options: Options,
  padding: string,
  position?: 'FIRST' | 'MIDDLE' | 'LAST'
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
  const { flagsActivated } = getFlagsActivated()
  flagsActivated.forEach((flag) => {
    assertUsage(
      (flags as readonly string[]).includes(flag),
      `Unknown DEBUG flag ${pc.cyan(flag)}. Valid flags:\n${flags.map((f) => `  ${pc.cyan(f)}`).join('\n')}`
    )
  })
}

function getFlagsActivated() {
  const flagsActivated: string[] = DEBUG.match(flagRegex) ?? []
  const all = DEBUG.includes('vike:*')
  return { flagsActivated, all }
}

function isDebug() {
  const { flagsActivated, all } = getFlagsActivated()
  return all || flagsActivated.length > 0
}

function getDEBUG() {
  let DEBUG: undefined | string
  // - `process` can be undefined in edge workers
  // - We want bundlers to be able to statically replace `process.env.*`
  try {
    DEBUG = process.env.DEBUG
  } catch {}
  return DEBUG
}
