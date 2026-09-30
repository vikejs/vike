// Streamed pageContext values, client-side (see server/runtime/renderPageServer/streamedValues.ts): the placeholders in
// the serialized pageContext become a ReadableStream, a Promise or an async iterable, fed by the lines that follow the
// pageContext:
// - First render: the lines pushed to `self.__vike_streamed` by the `<script>` tags of the HTML.
// - Client-side navigation: the lines of the `.pageContext.json` response.
//
// Loaded only if the pageContext has streamed values (see getJsonSerializedInHtml.ts and
// ../runtime-client-routing/streamedValues.ts).

export { parsePageContextHtml }
export { readPageContextJsonStreamed }

import { parse, parseTransform, type Reviver } from '@brillout/json-serializer/parse'
import { assert } from '../../utils/assert.js'
import { isObject } from '../../utils/isObject.js'
import { markers, pageContextJsonLinesEnd } from '../../shared-server-client/streamedValues.js'
import '../assertEnvClient.js'

type Kind = 'stream' | 'promise' | 'asyncIterable'
const prefixes: [string, Kind][] = [
  [markers.readableStream, 'stream'],
  [markers.promise, 'promise'],
  [markers.asyncIterable, 'asyncIterable'],
]

type Line = Record<string, unknown>
const textEncoder = new TextEncoder()
type Entry = { value: unknown; push(line: Line): void; fail(err: unknown): void }

function createReceiver() {
  const entries = new Map<number, Entry>()

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
      return {
        value: promise,
        push: (line) => ('v' in line ? resolve(parseTransform(line.v, { reviver })) : reject(getLineError())),
        fail: reject,
      }
    }
    let controller!: ReadableStreamDefaultController<unknown>
    let isClosed = false
    const stream = new ReadableStream<unknown>({
      start(controller_) {
        controller = controller_
      },
      cancel() {
        // Released by its consumer: the rest is ignored
        isClosed = true
      },
    })
    const close = (err?: unknown) => {
      if (isClosed) return
      isClosed = true
      if (err) controller.error(err)
      else controller.close()
    }
    return {
      value: kind === 'stream' ? stream : toAsyncIterable(stream),
      push(line) {
        if (isClosed) return
        if (typeof line.t === 'string') controller.enqueue(textEncoder.encode(line.t))
        else if (typeof line.b === 'string') controller.enqueue(decodeBase64url(line.b))
        else if ('v' in line) controller.enqueue(parseTransform(line.v, { reviver }))
        else if (line.end === true) close()
        else close(getLineError())
      },
      fail: close,
    }
  }

  return {
    reviver,
    onLine(lineStr: string) {
      const line = JSON.parse(lineStr) as Line
      // Unknown if contained in a chunk nobody read
      entries.get(line.s as number)?.push(line)
    },
    /** The response failed, ended or was cancelled: the values that didn't end fail */
    fail(err: unknown) {
      entries.forEach((entry) => entry.fail(err))
    },
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

function getLineError() {
  return new Error('A streamed pageContext value failed on the server-side (see the server logs)')
}

// Like an async generator: `for await (const chunk of pageContext.someAsyncIterable)`
function toAsyncIterable(stream: ReadableStream<unknown>): AsyncIterableIterator<unknown> {
  const reader = stream.getReader()
  const iterator: AsyncIterableIterator<unknown> = {
    next: () => reader.read() as Promise<IteratorResult<unknown>>,
    // Called upon `break` in `for await`
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
function parsePageContextHtml(pageContextJson: string): unknown {
  const receiver = createReceiver()
  const pageContext = parse(pageContextJson, { reviver: receiver.reviver })
  const g = self as { __vike_streamed?: string[] | { push(line: string): void } }
  const linesQueued = Array.isArray(g.__vike_streamed) ? g.__vike_streamed : []
  g.__vike_streamed = { push: receiver.onLine }
  linesQueued.forEach(receiver.onLine)
  return pageContext
}

// Client-side navigation: the `.pageContext.json` response (see server/runtime/renderPageServer/pageContextJson.ts),
// after its first line was read.
function readPageContextJsonStreamed(
  lineFirst: string,
  rest: string,
  reader: ReadableStreamDefaultReader<Uint8Array>,
  decoder: TextDecoder,
): Record<string, unknown> {
  const receiver = createReceiver()
  const pageContextFromServer = parse(lineFirst + pageContextJsonLinesEnd, { reviver: receiver.reviver })
  assert(isObject(pageContextFromServer))
  delete pageContextFromServer._streamedValues
  ;(async () => {
    let buffer = rest
    try {
      while (true) {
        let i: number
        while ((i = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, i)
          buffer = buffer.slice(i + 1)
          if (line !== pageContextJsonLinesEnd) receiver.onLine(line.startsWith(',') ? line.slice(1) : line)
        }
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
      }
      receiver.fail(new Error('The pageContext.json response ended before the streamed pageContext values ended'))
    } catch (err) {
      // E.g. the server aborted the response
      receiver.fail(err)
    }
  })()
  return pageContextFromServer
}

function decodeBase64url(str: string): Uint8Array {
  const binary = atob(str.replaceAll('-', '+').replaceAll('_', '/'))
  return Uint8Array.from(binary, (c) => c.charCodeAt(0))
}
