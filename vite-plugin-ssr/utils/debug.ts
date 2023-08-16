export { createDebugger }
export { isDebugEnabled }
export type { Debug }

import { isBrowser } from './isBrowser.js'
import { isCallable } from './isCallable.js'
import { objectAssign } from './objectAssign.js'
import { assert } from './assert.js'
import { checkType } from './checkType.js'
import { getTerminalWidth } from './getTerminWidth.js'

// Avoid this to be loaded in the browser. For isomorphic code: instead of `import { createDebugger } from './utils.js'`, use `globalThis.createDebugger()`.
assert(!isBrowser())
;(globalThis as any).__brillout_debug_createDebugger = createDebugger

type Namespace =
  | 'vps:error'
  | 'vps:extractAssets'
  | 'vps:extractExportNames'
  | 'vps:glob'
  | 'vps:pageFiles'
  | 'vps:log'
  | 'vps:routing'
  | 'vps:virtual-files'
  | 'vps:stem'
  | 'vps:stream'
type Debug = ReturnType<typeof createDebugger>

type Options = {
  serialization?: {
    emptyArray?: string
  }
}

function createDebugger(namespace: Namespace, optionsGlobal?: Options) {
  checkType<`vps:${string}`>(namespace)

  const debugWithOptions = (options: Options) => {
    return (...msgs: unknown[]) => {
      if (!isDebugEnabled(namespace)) return
      let [msgFirst, ...msgsRest] = msgs
      const padding = ' '.repeat(namespace.length + 1)
      const optionsResolved = { ...optionsGlobal, ...options }
      msgFirst = formatMsg(msgFirst, optionsResolved, padding, 'FIRST')
      msgsRest = msgsRest.map((msg, i) => {
        const position = i === msgsRest.length - 1 ? 'LAST' : 'MIDDLE'
        return formatMsg(msg, optionsResolved, padding, position)
      })
      console.log('\x1b[1m%s\x1b[0m', namespace, msgFirst)
      msgsRest.forEach((msg) => {
        console.log(msg)
      })
    }
  }
  const debug = (...msgs: unknown[]) => debugWithOptions({})(...msgs)
  objectAssign(debug, { options: debugWithOptions, isEnabled: isDebugEnabled(namespace) })
  return debug
}

function isDebugEnabled(namespace: Namespace): boolean {
  checkType<`vps:${string}`>(namespace)

  let DEBUG: undefined | string
  // - `process` can be undefined in edge workers
  // - We want bundlers to be able to statically replace `process.env.*`
  try {
    DEBUG = process.env.DEBUG
  } catch {}
  return DEBUG?.includes(namespace) ?? false
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
  } else if (Array.isArray(info)) {
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
