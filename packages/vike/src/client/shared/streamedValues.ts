// Streamed pageContext values, client-side (see server/runtime/renderPageServer/streamedValues.ts): the placeholders in
// the serialized pageContext become a ReadableStream, a Promise or an async iterable, fed by the lines that follow the
// pageContext:
// - First render: the lines pushed to `self.__vike_streamed` by the `<script>` tags of the HTML.
// - Client-side navigation: the lines of the `.pageContext.json` response, read only while a value wants more
//   (backpressure).
//
// Loaded only if the pageContext has streamed values (see getJsonSerializedInHtml.ts and getPageContextFromHooks.ts).

export { parsePageContextHtml }
export { readPageContextJson }

import { parse, parseTransform, type Reviver } from '@brillout/json-serializer/parse'
import { assert } from '../../utils/assert.js'
import { isObject } from '../../utils/isObject.js'
import '../assertEnvClient.js'

type Kind = 'stream' | 'promise' | 'asyncIterable'
const prefixes: [string, Kind][] = [
  ['!VikeStream:', 'stream'],
  ['!VikePromise:', 'promise'],
  ['!VikeAsyncIterable:', 'asyncIterable'],
]
// The number of chunks a stream buffers before the response isn't read further
const highWaterMark = 16

type Line = Record<string, unknown>
type Entry = {
  value: unknown
  isSettled: boolean
  push(line: Line): void
  fail(err: unknown): void
  wantsMore(): boolean
}

function createReceiver(onChange?: () => void) {
  const entries = new Map<number, Entry>()
  let onDemand: (() => void)[] = []
  const notify = () => {
    onDemand.forEach((resolve) => resolve())
    onDemand = []
    onChange?.()
  }

  const reviver: Reviver = (_path, value) => {
    const placeholder = parsePlaceholder(value)
    if (!placeholder) return undefined
    // The same value referenced twice
    let entry = entries.get(placeholder.id)
    if (!entry) {
      entry = createEntry(placeholder.kind)
      entries.set(placeholder.id, entry)
    }
    return { replacement: entry.value }
  }

  const createEntry = (kind: Kind): Entry => {
    if (kind === 'promise') {
      let resolve!: (value: unknown) => void
      let reject!: (err: unknown) => void
      const promise = new Promise((resolve_, reject_) => {
        resolve = resolve_
        reject = reject_
      })
      // Avoid an unhandled rejection if the user doesn't use the promise
      promise.catch(() => {})
      const entry: Entry = {
        value: promise,
        isSettled: false,
        push(line) {
          if ('v' in line) {
            const value = parseTransform(line.v, { reviver })
            entry.isSettled = true
            resolve(value)
          } else {
            entry.fail(getErrorLine(line))
          }
        },
        fail(err) {
          entry.isSettled = true
          reject(err)
        },
        wantsMore: () => !entry.isSettled,
      }
      return entry
    }
    let controller!: ReadableStreamDefaultController<unknown>
    // The chunks received before the value failed are read before the error
    let error: null | { err: unknown } = null
    const errorIfDrained = () => {
      if (error && controller.desiredSize === highWaterMark) controller.error(error.err)
    }
    const stream = new ReadableStream<unknown>(
      {
        start(controller_) {
          controller = controller_
        },
        pull() {
          errorIfDrained()
          notify()
        },
        cancel() {
          // Released by its consumer
          entry.isSettled = true
          notify()
        },
      },
      { highWaterMark },
    )
    const entry: Entry = {
      value: kind === 'stream' ? stream : toAsyncIterable(stream),
      isSettled: false,
      push(line) {
        if (entry.isSettled) {
          // A chunk nobody reads: the values it contains are still received, as other values may reference them
          if ('v' in line) parseTransform(line.v, { reviver })
          return
        }
        if (typeof line.t === 'string') controller.enqueue(new TextEncoder().encode(line.t))
        else if (typeof line.b === 'string') controller.enqueue(decodeBase64url(line.b))
        else if ('v' in line) controller.enqueue(parseTransform(line.v, { reviver }))
        else if (line.end === true) {
          entry.isSettled = true
          controller.close()
        } else entry.fail(getErrorLine(line))
      },
      fail(err) {
        if (entry.isSettled) return
        entry.isSettled = true
        error = { err }
        errorIfDrained()
      },
      wantsMore: () => !entry.isSettled && controller.desiredSize! > 0,
    }
    return entry
  }

  return {
    reviver,
    onLine(lineStr: string) {
      const line: unknown = JSON.parse(lineStr)
      if (!isObject(line) || typeof line.s !== 'number' || !entries.has(line.s)) throw new Error('Malformed line')
      const entry = entries.get(line.s)!
      try {
        entry.push(line)
      } catch (err) {
        // E.g. a value that can't be parsed
        entry.fail(err)
      }
      notify()
    },
    /** The response failed, was truncated, or was cancelled: the values that didn't end fail */
    fail(err: unknown) {
      entries.forEach((entry) => entry.fail(err))
      notify()
    },
    /** Whether a value wants more lines: a pending Promise, or a stream whose buffer isn't full */
    wantsMore: () => [...entries.values()].some((entry) => entry.wantsMore()),
    /** Whether all values ended or were released by their consumer: the rest of the response isn't needed */
    isReleased: () => [...entries.values()].every((entry) => entry.isSettled),
    waitForDemand: () => new Promise<void>((resolve) => onDemand.push(resolve)),
  }
}

function parsePlaceholder(value: string): null | { id: number; kind: Kind } {
  for (const [prefix, kind] of prefixes) {
    if (!value.startsWith(prefix)) continue
    const id = value.slice(prefix.length)
    assert(/^\d+$/.test(id))
    return { id: Number(id), kind }
  }
  return null
}

function getErrorLine(line: Line) {
  if (line.error !== true) return new Error('Malformed line')
  return new Error('A streamed pageContext value failed on the server-side (see the server logs)')
}

// Like an async generator: `for await (const chunk of pageContext.someAsyncIterable)`
function toAsyncIterable(stream: ReadableStream<unknown>): AsyncIterableIterator<unknown> {
  const reader = stream.getReader()
  const iterator: AsyncIterableIterator<unknown> = {
    next: () => reader.read() as Promise<IteratorResult<unknown>>,
    // Called upon `break` in `for await`: the rest isn't read
    async return(value?: unknown) {
      await reader.cancel()
      return { done: true, value }
    },
    [Symbol.asyncIterator]: () => iterator,
  }
  return iterator
}

// First render: the `<script>` tags that follow `<script id="vike_pageContext">` push the lines to `self.__vike_streamed`,
// before and after Vike's client runtime is loaded.
type StreamedLines = { push(line: string): void }
function parsePageContextHtml(pageContextJson: string): unknown {
  const receiver = createReceiver()
  const pageContext = parse(pageContextJson, { reviver: receiver.reviver })
  const onLine = (line: string) => {
    try {
      receiver.onLine(line)
    } catch (err) {
      receiver.fail(err)
    }
  }
  const g = self as { __vike_streamed?: string[] | StreamedLines }
  const linesQueued = Array.isArray(g.__vike_streamed) ? g.__vike_streamed : []
  g.__vike_streamed = { push: onLine }
  linesQueued.forEach(onLine)
  // The HTML ended before all values ended (e.g. the server crashed)
  const onHtmlEnd = () => {
    if (!receiver.isReleased()) receiver.fail(new Error('The HTML ended before the streamed pageContext values ended'))
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onHtmlEnd, { once: true })
  else onHtmlEnd()
  return pageContext
}

// Client-side navigation: the `.pageContext.json` response (see server/runtime/renderPageServer/pageContextJson.ts),
// after its first line was read.
const lineLast = ']}'
function readPageContextJson(
  lineFirst: string,
  rest: string,
  reader: ReadableStreamDefaultReader<Uint8Array>,
  decoder: TextDecoder,
): { pageContextFromServer: Record<string, unknown>; cancel: () => void } {
  let buffer = rest
  let isDone = false
  let isEnded = false
  let isCancelled = false
  // Stop reading as soon as the values don't need the response anymore
  const release = () => {
    if (!isDone) reader.cancel().catch(() => {})
  }
  const receiver = createReceiver(() => {
    if (receiver.isReleased()) release()
  })
  const pageContextFromServer = parse(lineFirst + lineLast, { reviver: receiver.reviver })
  assert(isObject(pageContextFromServer))
  delete pageContextFromServer._streamedValues
  ;(async () => {
    try {
      while (true) {
        let start = 0
        let i: number
        while ((i = buffer.indexOf('\n', start)) !== -1) {
          const line = buffer.slice(start, i)
          start = i + 1
          if (line === lineLast) isEnded = true
          else receiver.onLine(line.startsWith(',') ? line.slice(1) : line)
        }
        buffer = buffer.slice(start)
        if (isCancelled || receiver.isReleased()) break
        if (isEnded || isDone) {
          throw new Error('The pageContext.json response ended before the streamed pageContext values ended')
        }
        if (!receiver.wantsMore()) {
          await receiver.waitForDemand()
          continue
        }
        const { done, value } = await reader.read()
        isDone = done
        buffer += decoder.decode(value, { stream: !done })
      }
    } catch (err) {
      // The server aborted the response (e.g. it crashed), or it's malformed
      receiver.fail(err)
    } finally {
      release()
    }
  })()
  const cancel = () => {
    isCancelled = true
    receiver.fail(new Error("The pageContext wasn't used: its streamed values are cancelled"))
    release()
  }
  return { pageContextFromServer, cancel }
}

function decodeBase64url(str: string): Uint8Array {
  const binary = atob(str.replaceAll('-', '+').replaceAll('_', '/'))
  return Uint8Array.from(binary, (c) => c.charCodeAt(0))
}
