// Streamed pageContext values: a ReadableStream, a Promise or an async iterable (e.g. an async generator) anywhere in a
// passToClient value. https://vike.dev/passToClient#streaming
//
// - Serialization: a placeholder `"!VikeStream:<id>"` / `"!VikePromise:<id>"` / `"!VikeAsyncIterable:<id>"` (a
//   @brillout/json-serializer replacer; the serializer escapes user strings starting with `!`, so a user string can't be
//   mistaken for a placeholder).
// - Delivery: after the serialized pageContext, in the same response, one JSON line per chunk / result:
//   - Client-side navigation and pre-rendered `index.pageContext.json`: see pageContextJson.ts
//   - HTML: see html/streamedValuesHtml.ts
//
// Lines:
//   {"s":<id>,"t":<text>}      A chunk that is a Uint8Array of valid UTF-8
//   {"s":<id>,"b":<base64url>} A chunk that is any other Uint8Array
//   {"s":<id>,"v":<value>}     Any other chunk, or the value of a Promise (@brillout/json-serializer)
//   {"s":<id>,"end":true}      The end of a ReadableStream / async iterable
//   {"s":<id>,"error":true}    The stream / async iterable failed, or the Promise rejected (the error is logged on the
//                              server-side and isn't sent to the client)
//
// A chunk or a Promise value can contain further streamed values: they get new ids and their lines follow in the same
// response. The line introducing an id is always written before the lines of that id.
//
// Design reference (no shared code): Telefunc, which supports streams, promises and async generators in telefunction
// return values.

export { getStreamedValuesSerializer }
export { pumpStreamedValues }
export type { StreamedValue }

import { stringify, type Replacer } from '@brillout/json-serializer/stringify'
import { assert } from '../../../utils/assert.js'
import { isPromise } from '../../../utils/isPromise.js'
import '../../assertEnvServer.js'

type Kind = 'stream' | 'promise' | 'asyncIterable'
type StreamedValue = { id: number; kind: Kind; value: unknown }
const prefixes: Record<Kind, string> = {
  stream: '!VikeStream:',
  promise: '!VikePromise:',
  asyncIterable: '!VikeAsyncIterable:',
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
function getRegistry(pageContext: object): Registry {
  let registry = registries.get(pageContext)
  if (!registry) {
    registry = { byValue: new Map(), idNext: 0 }
    registries.set(pageContext, registry)
  }
  return registry
}
function getReplacer(registry: Registry, onValue: (streamedValue: StreamedValue) => void): Replacer {
  return (_key, value) => {
    const kind = getKind(value)
    if (!kind) return undefined
    // The same value referenced twice is sent once (a stream can be read only once)
    let streamedValue = registry.byValue.get(value)
    if (!streamedValue) {
      streamedValue = { id: registry.idNext++, kind, value }
      registry.byValue.set(value, streamedValue)
    }
    onValue(streamedValue)
    return { replacement: prefixes[streamedValue.kind] + streamedValue.id, resolved: true }
  }
}

// The serialization of pageContext can be attempted several times (a non-serializable passToClient value is replaced with
// NOT_SERIALIZABLE and the serialization is retried, see serializeContext.ts): only the values referenced by the attempt
// that succeeded are sent, the others are cancelled.
function getStreamedValuesSerializer(pageContext: object) {
  const registry = getRegistry(pageContext)
  const seen = new Set<StreamedValue>()
  let used = new Set<StreamedValue>()
  const replacer = getReplacer(registry, (streamedValue) => {
    seen.add(streamedValue)
    used.add(streamedValue)
  })
  return {
    replacer,
    beginAttempt() {
      used = new Set()
    },
    commit(): StreamedValue[] {
      cancel([...seen].filter((streamedValue) => !used.has(streamedValue)))
      return [...used]
    },
  }
}

function cancel(streamedValues: StreamedValue[], reason?: unknown) {
  streamedValues.forEach(({ kind, value }) => {
    if (kind === 'stream') {
      const stream = value as ReadableStream
      if (!stream.locked) stream.cancel(reason).catch(() => {})
    }
    if (kind === 'promise') {
      // Avoid an unhandled rejection
      ;(value as Promise<unknown>).then(undefined, () => {})
    }
    if (kind === 'asyncIterable') {
      // Nothing to cancel: we didn't call its [Symbol.asyncIterator]() yet
    }
  })
}

// Reads the values concurrently and calls `write()` with one line per chunk / result; `write()` enqueues the line
// synchronously and returns a promise that resolves when the consumer is ready for more (backpressure).
// - `failFast: false` (responses): a value that fails is logged and sent as an error line; the other values keep
//   streaming.
// - `failFast: true` (pre-rendering): a value that fails cancels all values and rejects `done`.
function pumpStreamedValues(
  pageContext: object,
  streamedValues: StreamedValue[],
  write: (line: string) => void | Promise<void>,
  { failFast, onError }: { failFast: boolean; onError: (err: unknown) => void },
): { done: Promise<void>; cancel: (reason?: unknown) => void } {
  const registry = getRegistry(pageContext)
  const started = new Set<StreamedValue>()
  const cancelFns = new Set<() => void>()
  let pending = 0
  let isCancelled = false
  let resolve!: () => void
  let reject!: (err: unknown) => void
  const done = new Promise<void>((resolve_, reject_) => {
    resolve = resolve_
    reject = reject_
  })

  const cancelAll = (reason?: unknown) => {
    if (isCancelled) return
    isCancelled = true
    cancelFns.forEach((cancelFn) => cancelFn())
    cancel(
      [...registry.byValue.values()].filter((streamedValue) => !started.has(streamedValue)),
      reason,
    )
    resolve()
  }

  const start = (streamedValue: StreamedValue) => {
    if (started.has(streamedValue) || isCancelled) return
    started.add(streamedValue)
    pending++
    pump(streamedValue).then(
      () => {
        if (--pending === 0) resolve()
      },
      (err) => {
        reject(err)
        cancelAll(err)
      },
    )
  }

  // A line's value can contain new streamed values: they're started after the line is written
  const writeLine = async (line: { s: number } & Record<string, unknown>, value?: unknown) => {
    const valuesNew: StreamedValue[] = []
    let lineStr: string
    if ('v' in line) {
      let serialized: string
      try {
        serialized = stringify(value, {
          forbidReactElements: true,
          valueName: 'a streamed pageContext value',
          replacer: getReplacer(registry, (streamedValue) => {
            if (!started.has(streamedValue)) valuesNew.push(streamedValue)
          }),
          htmlScriptSafe: { escapeScripts: true, escapeURLs: false },
        })
      } catch (err) {
        cancel(valuesNew)
        throw err
      }
      lineStr = `{"s":${line.s},"v":${serialized}}`
    } else {
      lineStr = JSON.stringify(line)
    }
    // JSON.stringify() escapes line breaks: one line per JSON value
    assert(!lineStr.includes('\n'))
    const ready = write(lineStr)
    valuesNew.forEach(start)
    await ready
  }

  const pump = async (streamedValue: StreamedValue) => {
    const { id: s, kind, value } = streamedValue
    try {
      if (kind === 'promise') {
        const resolved = await (value as Promise<unknown>)
        if (isCancelled) return
        await writeLine({ s, v: true }, resolved)
        return
      }
      let next: () => Promise<IteratorResult<unknown>>
      if (kind === 'stream') {
        const reader = (value as ReadableStream).getReader()
        next = () => reader.read() as Promise<IteratorResult<unknown>>
        cancelFns.add(() => reader.cancel().catch(() => {}))
      } else {
        const iterator = (value as AsyncIterable<unknown>)[Symbol.asyncIterator]()
        next = () => iterator.next()
        cancelFns.add(() => {
          Promise.resolve(iterator.return?.()).catch(() => {})
        })
      }
      if (isCancelled) return
      while (true) {
        const { done, value: chunk } = await next()
        if (isCancelled) return
        if (done) break
        if (chunk instanceof Uint8Array) {
          const text = decodeUtf8(chunk)
          await writeLine(text !== null ? { s, t: text } : { s, b: encodeBase64url(chunk) })
        } else {
          await writeLine({ s, v: true }, chunk)
        }
        if (isCancelled) return
      }
      await writeLine({ s, end: true })
    } catch (err) {
      if (isCancelled) return
      if (failFast) throw err
      onError(err)
      await writeLine({ s, error: true })
    }
  }

  streamedValues.forEach(start)
  if (pending === 0) resolve()
  return { done, cancel: cancelAll }
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
