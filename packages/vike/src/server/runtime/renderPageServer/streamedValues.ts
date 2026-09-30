// Streamed pageContext values, server-side (see shared-server-client/streamedValues.ts)

export { getStreamedValuesSerializer }
export { pumpStreamedValues }
export type { StreamedValue }

import { stringify, type Replacer } from '@brillout/json-serializer/stringify'
import { assert } from '../../../utils/assert.js'
import { isPromise } from '../../../utils/isPromise.js'
import { logRuntimeError, type PageContext_logRuntime } from '../loggerRuntime.js'
import { markers } from '../../../shared-server-client/streamedValues.js'
import '../../assertEnvServer.js'

type Kind = 'stream' | 'promise' | 'asyncIterable'
type StreamedValue = { id: number; kind: Kind; value: unknown }
const prefixes: Record<Kind, string> = {
  stream: markers.readableStream,
  promise: markers.promise,
  asyncIterable: markers.asyncIterable,
}

function getKind(value: unknown): Kind | null {
  if (value instanceof ReadableStream) return 'stream'
  if (isPromise(value)) return 'promise'
  if (typeof value === 'object' && value !== null && Symbol.asyncIterator in value) return 'asyncIterable'
  return null
}

// One registry per pageContext: the HTML and the `index.pageContext.json` of a pre-rendered page reference the same
// values with the same ids.
type Registry = { byValue: Map<unknown, StreamedValue>; idNext: number }
const registries = new WeakMap<object, Registry>()
function getReplacer(pageContext: object, onValue: (streamedValue: StreamedValue) => void): Replacer {
  let registry = registries.get(pageContext)
  if (!registry) registries.set(pageContext, (registry = { byValue: new Map(), idNext: 0 }))
  return (_key, value) => {
    const kind = getKind(value)
    if (!kind) return undefined
    let streamedValue = registry.byValue.get(value)
    if (!streamedValue) {
      streamedValue = { id: registry.idNext++, kind, value }
      registry.byValue.set(value, streamedValue)
    }
    onValue(streamedValue)
    return { replacement: prefixes[kind] + streamedValue.id, resolved: true }
  }
}

function getStreamedValuesSerializer(pageContext: object) {
  const streamedValues = new Set<StreamedValue>()
  const replacer = getReplacer(pageContext, (streamedValue) => streamedValues.add(streamedValue))
  return { replacer, getStreamedValues: () => [...streamedValues] }
}

// Reads the values concurrently and calls `write()` with one line per chunk / result.
// - `failFast: false` (responses): a value that fails is logged and sent as an error line.
// - `failFast: true` (pre-rendering): a value that fails rejects `done`.
function pumpStreamedValues(
  pageContext: NonNullable<PageContext_logRuntime>,
  streamedValues: StreamedValue[],
  write: (line: string) => void,
  { failFast }: { failFast: boolean },
): { done: Promise<void>; cancel: () => void } {
  const started = new Set<unknown>()
  const releases = new Set<() => void>()
  let pending = 0
  let isEnded = false
  let resolve!: () => void
  let reject!: (err: unknown) => void
  const done = new Promise<void>((resolve_, reject_) => {
    resolve = resolve_
    reject = reject_
  })

  const end = (err?: { err: unknown }) => {
    if (isEnded) return
    isEnded = true
    releases.forEach((release) => release())
    if (err) reject(err.err)
    else resolve()
  }

  const start = (streamedValue: StreamedValue) => {
    // The same value referenced twice is sent once (a stream can be read only once)
    if (started.has(streamedValue.value) || isEnded) return
    started.add(streamedValue.value)
    pending++
    pump(streamedValue).then(
      () => {
        if (--pending === 0) end()
      },
      (err) => end({ err }),
    )
  }
  // A line's value can contain new streamed values: they're started after the line is written
  const writeLine = (line: { s: number } & Record<string, unknown>) => {
    const valuesNew: StreamedValue[] = []
    let lineStr: string
    if ('v' in line) {
      const serialized = stringify(line.v, {
        forbidReactElements: true,
        valueName: 'a streamed pageContext value',
        replacer: getReplacer(pageContext, (streamedValue) => valuesNew.push(streamedValue)),
        htmlScriptSafe: { escapeScripts: true, escapeURLs: false },
      })
      lineStr = `{"s":${line.s},"v":${serialized}}`
    } else {
      lineStr = JSON.stringify(line)
    }
    // JSON.stringify() escapes line breaks: one line per JSON value
    assert(!lineStr.includes('\n'))
    write(lineStr)
    valuesNew.forEach(start)
  }

  const pump = async ({ id: s, kind, value }: StreamedValue) => {
    // Stops the value's producer: when the value fails, or when the response is cancelled
    let release = () => {}
    try {
      if (kind === 'promise') {
        const resolved = await (value as Promise<unknown>)
        if (!isEnded) writeLine({ s, v: resolved })
        return
      }
      let next: () => Promise<IteratorResult<unknown>>
      if (kind === 'stream') {
        const reader = (value as ReadableStream).getReader()
        next = () => reader.read() as Promise<IteratorResult<unknown>>
        release = () => reader.cancel().catch(() => {})
      } else {
        const iterator = (value as AsyncIterable<unknown>)[Symbol.asyncIterator]()
        next = () => iterator.next()
        release = () => Promise.resolve(iterator.return?.()).catch(() => {})
      }
      releases.add(release)
      while (true) {
        const { done, value: chunk } = await next()
        if (isEnded) return
        if (done) break
        if (chunk instanceof Uint8Array) {
          const text = decodeUtf8(chunk)
          writeLine(text !== null ? { s, t: text } : { s, b: encodeBase64url(chunk) })
        } else {
          writeLine({ s, v: chunk })
        }
      }
      writeLine({ s, end: true })
    } catch (err) {
      if (isEnded) return
      release()
      if (failFast) throw err
      logRuntimeError(err, pageContext)
      writeLine({ s, error: true })
    } finally {
      releases.delete(release)
    }
  }

  streamedValues.forEach(start)
  if (pending === 0) end()
  return { done, cancel: () => end() }
}

const utf8Decoder = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true })
function decodeUtf8(bytes: Uint8Array): string | null {
  try {
    return utf8Decoder.decode(bytes)
  } catch {
    return null
  }
}
function encodeBase64url(bytes: Uint8Array): string {
  let binary = ''
  // In slices: spreading a large array into a single call overflows the stack
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  }
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
}
