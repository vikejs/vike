import { describe, it, expect, vi, beforeEach } from 'vitest'
vi.mock('../../../client/assertEnvClient.js', () => ({}))
vi.mock('../loggerRuntime.js', () => ({ logRuntimeError: vi.fn() }))
import { stringify } from '@brillout/json-serializer/stringify'
import { getStreamedValuesSerializer, pumpStreamedValues } from './streamedValues.js'
import { getPageContextJson, getPageContextJsonFile } from './pageContextJson.js'
import {
  serializePageContextHtml,
  sendStreamedValuesInHtml,
  getStreamedValuesHtml,
  getStreamedValuesLinesPrerendered,
  cancelStreamedValuesHtml,
} from './html/streamedValuesHtml.js'
import { processStream, pipeToStreamWritableNode, stampPipe } from './html/stream.js'
import { Readable, PassThrough } from 'node:stream'
import { parsePageContextHtml, readPageContextJson } from '../../../client/shared/streamedValues.js'
import { logRuntimeError } from '../loggerRuntime.js'

const enc = (s: string) => new TextEncoder().encode(s)
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
function streamOf(chunks: unknown[], opts: { onPull?: () => void; onCancel?: () => void; errorAt?: number } = {}) {
  let i = 0
  return new ReadableStream<unknown>(
    {
      pull(c) {
        opts.onPull?.()
        if (i === opts.errorAt) c.error(new Error('stream failed'))
        else if (i < chunks.length) c.enqueue(chunks[i++])
        else c.close()
      },
      cancel: () => opts.onCancel?.(),
    },
    { highWaterMark: 0 },
  )
}
function deferred<T = unknown>() {
  let resolve!: (v: T) => void
  let reject!: (e: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}
async function readAll(value: unknown): Promise<unknown[]> {
  const chunks: unknown[] = []
  if (value instanceof ReadableStream) {
    const reader = value.getReader()
    while (true) {
      const { done, value: chunk } = await reader.read()
      if (done) return chunks
      chunks.push(chunk)
    }
  }
  for await (const chunk of value as AsyncIterable<unknown>) chunks.push(chunk)
  return chunks
}

function serialize(obj: Record<string, unknown>, pageContext: object) {
  const serializer = getStreamedValuesSerializer(pageContext)
  serializer.beginAttempt()
  const serialized = stringify(obj, { replacer: serializer.replacer })
  return { serialized, streamedValues: serializer.commit() }
}

// Client-side navigation: the server's `.pageContext.json` body, read by the client
async function navigation(obj: Record<string, unknown>, { withText = false } = {}) {
  const pageContext = {}
  const { serialized, streamedValues } = serialize(obj, pageContext)
  const onError = vi.mocked(logRuntimeError)
  let body = getPageContextJson(serialized, streamedValues, pageContext as any)
  if (typeof body === 'string') return { body, onError, pageContext: JSON.parse(body) }
  let text: undefined | Promise<string>
  // tee() reads the whole body (no backpressure, no cancellation)
  if (withText) {
    const [forClient, forText] = body.tee()
    body = forClient
    text = new Response(forText).text()
  }
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    const { done, value } = await reader.read()
    buffer += decoder.decode(value, { stream: !done })
    const i = buffer.indexOf('\n')
    if (i !== -1) {
      const res = readPageContextJson(buffer.slice(0, i), buffer.slice(i + 1), reader, decoder)
      return { ...res, pageContext: res.pageContextFromServer as any, text, onError }
    }
    expect(done).toBe(false)
  }
}

// First render: the server's `<script>` tags, run by the "browser", read by the client
function setBrowser() {
  const g = globalThis as any
  g.self = globalThis
  g.document = { readyState: 'loading', addEventListener: (_: string, fn: () => void) => (g.__onHtmlEnd = fn) }
  delete g.__vike_streamed
}
function runScripts(html: string, nonce: string) {
  const scripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)]
  expect(scripts.map((s) => s[0]).join('')).toBe(html)
  scripts.forEach(([, attrs, content]) => {
    expect(attrs).toBe(` nonce="${nonce}"`)
    expect(content).not.toMatch(/<\/script|<!--|<script/i)
    new Function(content!)()
  })
}
async function firstRender(obj: Record<string, unknown>, { runScriptsFirst = false } = {}) {
  setBrowser()
  const pageContextServer = { cspNonce: 'test-nonce', isPrerendering: false, _requestId: 1 } as any
  const { serialized, streamedValues } = serialize(obj, pageContextServer)
  sendStreamedValuesInHtml(pageContextServer, streamedValues, null)
  const getHtml = async () => (await getStreamedValuesHtml(pageContextServer))!
  let pageContext: any
  if (runScriptsFirst) {
    runScripts(await getHtml(), 'test-nonce')
    pageContext = parsePageContextHtml(serialized)
  } else {
    pageContext = parsePageContextHtml(serialized)
    // The scripts run after the client runtime loaded
    getHtml().then((html) => runScripts(html, 'test-nonce'))
  }
  return { pageContext, htmlEnded: () => (globalThis as any).__onHtmlEnd(), getHtml }
}

const bytes = Uint8Array.from({ length: 256 }, (_, i) => i)
function getValues() {
  async function* generator() {
    yield 1
    yield { date: new Date(0), inner: Promise.resolve('from generator') }
    yield enc('text')
  }
  const shared = Promise.resolve('shared')
  return {
    normal: { a: 1, s: '!VikeStream:0', u: undefined },
    stream: streamOf([enc('hello\n'), bytes, enc('€').slice(0, 2), { obj: true }]),
    promise: Promise.resolve({ bytes, map: new Map([[1, 2]]) }),
    generator: generator(),
    nested: Promise.resolve({ stream: streamOf([enc('nested')]), deeper: Promise.resolve(Promise.resolve(42)) }),
    array: [shared, shared],
  }
}
async function expectValues(pageContext: any) {
  expect(pageContext.normal).toEqual({ a: 1, s: '!VikeStream:0', u: undefined })
  expect(pageContext.stream).toBeInstanceOf(ReadableStream)
  const chunks = await readAll(pageContext.stream)
  expect(new TextDecoder().decode(chunks[0] as Uint8Array)).toBe('hello\n')
  expect(chunks[1]).toEqual(bytes)
  expect(chunks[2]).toEqual(enc('€').slice(0, 2))
  expect(chunks[3]).toEqual({ obj: true })
  expect(await pageContext.promise).toEqual({ bytes, map: new Map([[1, 2]]) })
  const generated = await readAll(pageContext.generator)
  expect(generated[0]).toBe(1)
  expect((generated[1] as any).date).toEqual(new Date(0))
  expect(await (generated[1] as any).inner).toBe('from generator')
  expect(generated[2]).toEqual(enc('text'))
  const nested = await pageContext.nested
  expect(await readAll(nested.stream)).toEqual([enc('nested')])
  expect(await nested.deeper).toBe(42)
  // The same value referenced twice is one value
  expect(pageContext.array[0]).toBe(pageContext.array[1])
  expect(await pageContext.array[0]).toBe('shared')
}

beforeEach(() => {
  vi.mocked(logRuntimeError).mockClear()
})

describe('streamed pageContext values: client-side navigation', () => {
  it('round-trips every kind, nested and mixed, with exact bytes', async () => {
    const { pageContext, text, onError } = await navigation(getValues(), { withText: true })
    await expectValues(pageContext)
    expect(onError).not.toHaveBeenCalled()
    // The body is one valid JSON value
    const json = JSON.parse(await text!)
    expect(json.stream).toBe('!VikeStream:0')
    expect(json._streamedValues.at(-1)).toEqual({ s: expect.any(Number), end: true })
  })

  it('without streamed values: the body is the serialized pageContext, as is', async () => {
    const { body } = await navigation({ a: 1, date: new Date(0) })
    expect(body).toBe(stringify({ a: 1, date: new Date(0) }))
    expect(getPageContextJsonFile('{"a":1}', null)).toBe('{"a":1}')
  })

  it('sends the pageContext before the values are produced, and each chunk as produced', async () => {
    const chunk2 = deferred<void>()
    let produced = 0
    async function* slow() {
      produced++
      yield 'first'
      await chunk2.promise
      produced++
      yield 'last'
    }
    const promise = deferred<string>()
    const { pageContext } = await navigation({ gen: slow(), promise: promise.promise })
    const it = pageContext.gen[Symbol.asyncIterator]()
    expect(await it.next()).toEqual({ done: false, value: 'first' })
    expect(produced).toBe(1)
    chunk2.resolve()
    expect(await it.next()).toEqual({ done: false, value: 'last' })
    promise.resolve('later')
    expect(await pageContext.promise).toBe('later')
  })

  it('a failing value fails alone; the error is logged, not sent', async () => {
    const values = {
      rejected: Promise.reject(new Error('secret')),
      failing: streamOf([enc('a'), enc('b')], { errorAt: 1 }),
      throwing: (async function* () {
        yield 'x'
        throw new Error('generator failed')
      })(),
      nonSerializable: Promise.resolve({ fn: () => {} }),
      ok: Promise.resolve('ok'),
    }
    const { pageContext, onError, text } = await navigation(values, { withText: true })
    await expect(pageContext.rejected).rejects.toThrow('failed on the server-side')
    const reader = pageContext.failing.getReader()
    expect(await reader.read()).toEqual({ done: false, value: enc('a') })
    await expect(reader.read()).rejects.toThrow('failed on the server-side')
    const it = pageContext.throwing[Symbol.asyncIterator]()
    expect((await it.next()).value).toBe('x')
    await expect(it.next()).rejects.toThrow('failed on the server-side')
    await expect(pageContext.nonSerializable).rejects.toThrow('failed on the server-side')
    expect(await pageContext.ok).toBe('ok')
    expect(onError).toHaveBeenCalledTimes(4)
    expect(await text).not.toContain('secret')
  })

  it('the client going away cancels all values on the server', async () => {
    const onCancel = vi.fn()
    const onReturn = vi.fn()
    async function* infinite() {
      try {
        while (true) yield 'tick'
      } finally {
        onReturn()
      }
    }
    const { cancel } = await navigation({ s: streamOf(Array(1000).fill(enc('x')), { onCancel }), g: infinite() })
    cancel()
    await sleep(10)
    expect(onCancel).toHaveBeenCalled()
    expect(onReturn).toHaveBeenCalled()
  })

  it('a consumer releasing all values releases the response', async () => {
    const onCancel = vi.fn()
    const { pageContext } = await navigation({ s: streamOf(Array(1000).fill(enc('x')), { onCancel }) })
    const reader = pageContext.s.getReader()
    await reader.read()
    await reader.cancel()
    await sleep(10)
    expect(onCancel).toHaveBeenCalled()
  })

  it('backpressure: a slow consumer pauses the producers', async () => {
    let pulls = 0
    const big = enc('x'.repeat(10_000))
    const { pageContext, cancel } = await navigation({
      s1: streamOf(Array(200).fill(big), { onPull: () => pulls++ }),
      s2: streamOf(Array(200).fill(big), { onPull: () => pulls++ }),
    })
    await sleep(50)
    // The client buffers 16 chunks per stream, the server 64 KiB: far from the 400 chunks (4 MB)
    expect(pulls).toBeLessThan(60)
    await pageContext.s1.getReader().read()
    cancel()
  })

  it('a malformed line fails the values that did not end', async () => {
    const reader = new Response('x\n{"s":0,"v":1}\n').body!.getReader()
    const { pageContextFromServer } = readPageContextJson(
      '{"a":"!VikePromise:0","b":"!VikeStream:1","_streamedValues":[',
      '',
      reader,
      new TextDecoder(),
    )
    const pageContext = pageContextFromServer as any
    expect(pageContext._streamedValues).toBe(undefined)
    await expect(pageContext.a).rejects.toThrow()
    await expect(readAll(pageContext.b)).rejects.toThrow()
  })

  it('pageContext._streamedValues is reserved', async () => {
    await expect(navigation({ _streamedValues: 1, p: Promise.resolve() })).rejects.toThrow('reserved')
  })
})

describe('streamed pageContext values: first render (HTML)', () => {
  it('round-trips every kind, with the CSP nonce, whether the scripts run before or after the client runtime', async () => {
    await expectValues((await firstRender(getValues())).pageContext)
    await expectValues((await firstRender(getValues(), { runScriptsFirst: true })).pageContext)
  })

  it("escapes </script> and <!-- (the script can't be broken out of)", async () => {
    const xss = '</script><script>alert(1)</script><!--  '
    const { pageContext, getHtml } = await firstRender({
      p: Promise.resolve({ xss }),
      s: streamOf([enc(xss)]),
      g: (async function* () {
        yield xss
      })(),
    })
    expect(await pageContext.p).toEqual({ xss })
    expect(new TextDecoder().decode((await readAll(pageContext.s))[0] as Uint8Array)).toBe(xss)
    expect(await readAll(pageContext.g)).toEqual([xss])
    expect(await getHtml()).not.toContain('</script><script>alert')
  })

  it('a stream failing mid-way: the chunks before the error are read, then the error', async () => {
    for (const runScriptsFirst of [true, false]) {
      const { pageContext } = await firstRender({ failing: streamOf([enc('a')], { errorAt: 1 }) }, { runScriptsFirst })
      const reader = pageContext.failing.getReader()
      expect(await reader.read()).toEqual({ done: false, value: enc('a') })
      await expect(reader.read()).rejects.toThrow('failed on the server-side')
    }
  })

  it('the HTML ending before the values end fails them', async () => {
    const { pageContext, htmlEnded } = await firstRender({ p: new Promise(() => {}) })
    htmlEnded()
    await expect(pageContext.p).rejects.toThrow('The HTML ended')
  })
})

describe('streamed pageContext values: pre-rendering', () => {
  it('the HTML and index.pageContext.json have the same lines, read once', async () => {
    let pulls = 0
    const pageContext = { cspNonce: null, isPrerendering: true, _requestId: 1 } as any
    const { serialized, streamedValues } = serialize(
      { s: streamOf([enc('a'), bytes], { onPull: () => pulls++ }), p: Promise.resolve(1) },
      pageContext,
    )
    sendStreamedValuesInHtml(pageContext, streamedValues, null)
    const html = (await getStreamedValuesHtml(pageContext))!
    // The pageContext.json is serialized after the HTML: same ids
    const { serialized: serializedJson, streamedValues: streamedValuesJson } = serialize(
      { s: streamedValues[0]!.value, p: streamedValues[1]!.value },
      pageContext,
    )
    expect(streamedValuesJson).toEqual(streamedValues)
    const lines = (await getStreamedValuesLinesPrerendered(pageContext))!
    const file = getPageContextJsonFile(serializedJson, lines)
    const json = JSON.parse(file)
    expect(json._streamedValues).toHaveLength(lines.length)
    expect(lines.every((line) => html.includes(JSON.stringify(line).slice(1, -1).replaceAll('/', '\\/')))).toBe(true)
    expect(pulls).toBe(3)
    expect(serialized).toBe(serializedJson)
  })

  it('a failing value fails the pre-rendering, and cancels the others', async () => {
    const onCancel = vi.fn()
    const pageContext = { cspNonce: null, isPrerendering: true, _requestId: 1 } as any
    const pending = new ReadableStream({ pull: () => new Promise(() => {}), cancel: onCancel }, { highWaterMark: 0 })
    const { streamedValues } = serialize({ p: Promise.reject(new Error('boom')), pending }, pageContext)
    sendStreamedValuesInHtml(pageContext, streamedValues, null)
    await getStreamedValuesHtml(pageContext)
    await expect(getStreamedValuesLinesPrerendered(pageContext)).rejects.toThrow('boom')
    expect(onCancel).toHaveBeenCalled()
  })
})

describe('streamed pageContext values: serialization', () => {
  it('only the values of the successful serialization attempt are sent, the others are cancelled at the end', async () => {
    const onCancel = vi.fn()
    const dropped = streamOf([], { onCancel })
    const kept = Promise.resolve(1)
    const pageContext = {}
    const serializer = getStreamedValuesSerializer(pageContext)
    serializer.beginAttempt()
    stringify({ dropped, kept }, { replacer: serializer.replacer })
    serializer.beginAttempt()
    const serialized = stringify({ kept }, { replacer: serializer.replacer })
    const streamedValues = serializer.commit()
    expect(streamedValues.map((v) => v.value)).toEqual([kept])
    expect(serialized).toBe(`{"kept":"!VikePromise:${streamedValues[0]!.id}"}`)
    await pumpStreamedValues(pageContext, streamedValues, () => {}, { failFast: false, onError: () => {} }).done
    expect(onCancel).toHaveBeenCalled()
  })

  it('without streamed values, the serialization is unchanged', () => {
    const obj = { a: [1, '!x', new Date(0)], b: { c: undefined } }
    expect(serialize(obj, {}).serialized).toBe(stringify(obj))
  })

  it('writes the line introducing a value before the lines of that value', async () => {
    const lines: string[] = []
    const pageContext = {}
    const { streamedValues } = serialize({ p: Promise.resolve({ inner: Promise.resolve(1) }) }, pageContext)
    await pumpStreamedValues(pageContext, streamedValues, (line) => void lines.push(line), {
      failFast: false,
      onError: () => {},
    }).done
    expect(lines).toEqual(['{"s":0,"v":{"inner":"!VikePromise:1"}}', '{"s":1,"v":1}'])
  })
})

describe('streamed pageContext values: cancellation', () => {
  it('a value that fails is cancelled at its source', async () => {
    const onCancel = vi.fn()
    const onReturn = vi.fn()
    const pageContext = {}
    const { streamedValues } = serialize(
      {
        s: streamOf([() => {}, 'unused'], { onCancel }),
        g: (async function* () {
          try {
            yield () => {}
            yield 'unused'
          } finally {
            onReturn()
          }
        })(),
      },
      pageContext,
    )
    const lines: string[] = []
    await pumpStreamedValues(pageContext, streamedValues, (line) => void lines.push(line), {
      failFast: false,
      onError: () => {},
    }).done
    expect(lines).toEqual(['{"s":0,"error":true}', '{"s":1,"error":true}'])
    expect(onCancel).toHaveBeenCalled()
    expect(onReturn).toHaveBeenCalled()
  })

  it("an iterator whose return() throws doesn't prevent cancelling the other values", async () => {
    const onCancel = vi.fn()
    const throwing = {
      [Symbol.asyncIterator]() {
        return this
      },
      next: () => new Promise(() => {}),
      return() {
        throw new Error('return() failed')
      },
    }
    const { cancel } = await navigation({ throwing, s: streamOf(Array(100).fill(enc('x')), { onCancel }) })
    cancel()
    await sleep(10)
    expect(onCancel).toHaveBeenCalled()
  })

  it('a value produced after the cancellation is cancelled', async () => {
    const promise = deferred<unknown>()
    const onCancel = vi.fn()
    const { cancel } = await navigation({ p: promise.promise })
    cancel()
    await sleep(10)
    promise.resolve({ s: streamOf([enc('x')], { onCancel }) })
    await sleep(10)
    expect(onCancel).toHaveBeenCalled()
  })

  it("the chunks of an async iterable the user stopped reading don't break the other values", async () => {
    const gate = deferred<void>()
    const promise = deferred<string>()
    async function* generator() {
      yield 1
      await gate.promise
      yield { nested: Promise.resolve('nested') }
    }
    const { pageContext } = await navigation({ g: generator(), p: promise.promise })
    for await (const _ of pageContext.g) break
    gate.resolve()
    await sleep(10)
    promise.resolve('ok')
    expect(await pageContext.p).toBe('ok')
  })

  it('HTML: a cancellation before the pageContext is serialized cancels the values', async () => {
    const pageContext = { cspNonce: null, isPrerendering: false, _requestId: 1 } as any
    cancelStreamedValuesHtml(pageContext)
    const onCancel = vi.fn()
    const { streamedValues } = serialize({ s: streamOf([enc('x')], { onCancel }) }, pageContext)
    sendStreamedValuesInHtml(pageContext, streamedValues, null)
    await sleep(10)
    expect(onCancel).toHaveBeenCalled()
  })

  it('HTML: cancelling the HTML stream, also while it ends, cancels the values', async () => {
    for (const whileEnding of [false, true]) {
      const onCancel = vi.fn()
      const ending = deferred<void>()
      const htmlDone = deferred<void>()
      const html = new ReadableStream<Uint8Array>({
        async start(controller) {
          controller.enqueue(enc('<html><body>'))
          if (whileEnding) controller.close()
          else htmlDone.promise.then(() => controller.close())
        },
      })
      const wrapper = (await processStream(html, {
        onErrorWhileStreaming: () => {},
        onCancel,
        injectStringAtEnd: async (writeHtml) => {
          writeHtml('<script>1</script>')
          await ending.promise
          return '</body></html>'
        },
      })) as ReadableStream
      const reader = wrapper.getReader()
      await reader.read()
      if (whileEnding) await reader.read()
      // Rejects: the wrapper cancels the HTML stream it has locked (also on main)
      await reader.cancel().catch(() => {})
      await sleep(10)
      expect(onCancel).toHaveBeenCalled()
      ending.resolve()
      htmlDone.resolve()
    }
  })

  it('HTML: the response closing destroys a Node.js Readable HTML stream', async () => {
    const readable = new Readable({ read() {} })
    const writable = new PassThrough()
    pipeToStreamWritableNode(readable, writable)
    writable.destroy()
    await sleep(10)
    expect(readable.destroyed).toBe(true)
  })
})

describe('streamed pageContext values: robustness', () => {
  it('a stream contained in a chunk that failed is still sent when a later chunk references it', async () => {
    const later = deferred<unknown>()
    const s = streamOf([enc('A')])
    const { pageContext } = await navigation({ bad: Promise.resolve({ s, fn() {} }), later: later.promise })
    await expect(pageContext.bad).rejects.toThrow('failed on the server-side')
    later.resolve({ s })
    expect(await readAll((await pageContext.later).s)).toEqual([enc('A')])
  })

  it('a value whose [Symbol.asyncIterator]() fails when cancelled does not prevent cancelling the others', async () => {
    const onCancel = vi.fn()
    const throwing = {
      [Symbol.asyncIterator]() {
        throw new Error('[Symbol.asyncIterator]() failed')
      },
    }
    const serializer = getStreamedValuesSerializer({})
    serializer.beginAttempt()
    stringify({ throwing, s: streamOf([], { onCancel }) }, { replacer: serializer.replacer })
    serializer.beginAttempt()
    expect(() => serializer.commit()).not.toThrow()
    await sleep(0)
    expect(onCancel).toHaveBeenCalled()
  })

  it('HTML: an async iterator failing synchronously fails alone', async () => {
    const throwing = {
      [Symbol.asyncIterator]() {
        return this
      },
      next() {
        throw new Error('next() failed')
      },
    }
    const { pageContext } = await firstRender({ throwing, ok: Promise.resolve('ok') })
    await expect(readAll(pageContext.throwing)).rejects.toThrow('failed on the server-side')
    expect(await pageContext.ok).toBe('ok')
  })

  it("HTML: a producer that never waits doesn't block the event loop", async () => {
    const pageContext = { cspNonce: null, isPrerendering: false, _requestId: 1 } as any
    const { streamedValues } = serialize(
      {
        g: (async function* () {
          while (true) yield 'x'
        })(),
      },
      pageContext,
    )
    sendStreamedValuesInHtml(pageContext, streamedValues, null)
    await sleep(20)
    cancelStreamedValuesHtml(pageContext)
  })

  it('HTML: cancelled before the pageContext is serialized, and never serialized: the values are cancelled', async () => {
    const onCancel = vi.fn()
    const pageContext = {
      pageId: '/pages/index',
      routeParams: {},
      is404: null,
      _passToClient: ['s'],
      _pageContextInit: {},
      _globalContext: { _pageConfigs: [{ pageId: '/pages/index', isErrorPage: undefined }] },
      _isHtmlOnly: false,
      s: streamOf([enc('x')], { onCancel }),
    } as any
    cancelStreamedValuesHtml(pageContext)
    await sleep(0)
    expect(onCancel).toHaveBeenCalled()
  })

  it('a chunk nobody reads: the values it contains are still received, as other values may reference them', async () => {
    const gate = deferred<void>()
    const shared = Promise.resolve('shared')
    async function* a() {
      yield 'first'
      await gate.promise
      yield { shared }
    }
    async function* b() {
      await gate.promise
      await sleep(10)
      yield { shared }
    }
    const { pageContext } = await navigation({ a: a(), b: b() })
    for await (const _ of pageContext.a) break
    gate.resolve()
    const [chunk] = await readAll(pageContext.b)
    expect(await (chunk as any).shared).toBe('shared')
  })

  it('a response ending before its values end fails them', async () => {
    const reader = new Response(']}\n').body!.getReader()
    const { pageContextFromServer } = readPageContextJson(
      '{"p":"!VikePromise:0","_streamedValues":[',
      '',
      reader,
      new TextDecoder(),
    )
    await expect((pageContextFromServer as any).p).rejects.toThrow('ended before')
  })
})

describe('streamed pageContext values: values that are not sent', () => {
  it('a serialization retry cancels the values it discards, but not the ones it sends', async () => {
    const onCancel = vi.fn()
    const kept = streamOf([enc('kept')])
    const dropped = streamOf([], { onCancel })
    const pageContext = {}
    const serializer = getStreamedValuesSerializer(pageContext)
    serializer.beginAttempt()
    expect(() =>
      stringify(
        { bad: { p: Promise.resolve({ kept, dropped }), fn() {} }, good: kept },
        { replacer: serializer.replacer },
      ),
    ).toThrow()
    serializer.beginAttempt()
    stringify({ bad: 'NOT_SERIALIZABLE', good: kept }, { replacer: serializer.replacer })
    const streamedValues = serializer.commit()
    const lines: string[] = []
    await pumpStreamedValues(pageContext, streamedValues, (line) => void lines.push(line), {
      failFast: false,
      onError: () => {},
    }).done
    expect(lines).toEqual([`{"s":1,"t":"kept"}`, `{"s":1,"end":true}`])
    expect(onCancel).toHaveBeenCalled()
  })

  it('the values contained in a circular value that fails, or arrives after the cancellation, are cancelled', async () => {
    for (const isCancelled of [false, true]) {
      const onCancel = vi.fn()
      // The cycle comes before the stream
      const circular: Record<string, unknown> = {}
      circular.self = circular
      circular.s = streamOf([], { onCancel })
      const promise = deferred<unknown>()
      const pageContext = {}
      const { streamedValues } = serialize({ p: promise.promise }, pageContext)
      const pump = pumpStreamedValues(pageContext, streamedValues, () => {}, { failFast: false, onError: () => {} })
      if (isCancelled) pump.cancel()
      promise.resolve(circular)
      await pump.done
      await sleep(0)
      expect(onCancel).toHaveBeenCalled()
    }
  })

  it('cancelling a Promise that resolves to an object containing it terminates', async () => {
    let visits = 0
    const circular: Record<string, unknown> = {}
    const promise = Promise.resolve(circular)
    Object.defineProperty(circular, 'p', {
      enumerable: true,
      get() {
        visits++
        return promise
      },
    })
    const serializer = getStreamedValuesSerializer({})
    serializer.beginAttempt()
    stringify({ promise }, { replacer: serializer.replacer })
    serializer.beginAttempt()
    serializer.commit()
    await sleep(10)
    expect(visits).toBe(1)
  })

  it("a thenable whose then() throws doesn't prevent cancelling the others", async () => {
    const onCancel = vi.fn()
    const thenable = {
      then() {
        throw new Error('then() failed')
      },
    }
    const serializer = getStreamedValuesSerializer({})
    serializer.beginAttempt()
    stringify({ thenable, s: streamOf([], { onCancel }) }, { replacer: serializer.replacer })
    serializer.beginAttempt()
    expect(() => serializer.commit()).not.toThrow()
    await sleep(0)
    expect(onCancel).toHaveBeenCalled()
  })
})

describe('streamed pageContext values: cancelled once, only when not sent', () => {
  const getPageContext = (props: Record<string, unknown>) =>
    ({
      pageId: '/pages/index',
      routeParams: {},
      is404: null,
      _passToClient: Object.keys(props),
      _pageContextInit: {},
      _globalContext: { _pageConfigs: [{ pageId: '/pages/index', isErrorPage: undefined }] },
      _isHtmlOnly: false,
      cspNonce: null,
      isPrerendering: false,
      _requestId: 1,
      ...props,
    }) as any

  it('a stream in a property the serialization retry discards is still sent by a kept Promise', async () => {
    const shared = streamOf([enc('kept')])
    const pageContext = {}
    const serializer = getStreamedValuesSerializer(pageContext)
    serializer.beginAttempt()
    expect(() => stringify({ bad: { shared, fn() {} } }, { replacer: serializer.replacer })).toThrow()
    serializer.beginAttempt()
    stringify({ bad: 'NOT_SERIALIZABLE', good: Promise.resolve({ shared }) }, { replacer: serializer.replacer })
    const streamedValues = serializer.commit()
    const lines: string[] = []
    await pumpStreamedValues(pageContext, streamedValues, (line) => void lines.push(line), {
      failFast: false,
      onError: () => {},
    }).done
    expect(lines).toEqual([`{"s":1,"v":{"shared":"!VikeStream:0"}}`, `{"s":0,"t":"kept"}`, `{"s":0,"end":true}`])
  })

  it('HTML: a value cancelled before the pageContext is serialized is cancelled once', async () => {
    let returned = 0
    const iterable = {
      [Symbol.asyncIterator]() {
        return { next: () => new Promise(() => {}), return: async () => (returned++, { done: true, value: undefined }) }
      },
    }
    const pageContext = getPageContext({ iterable })
    cancelStreamedValuesHtml(pageContext)
    serializePageContextHtml(pageContext, null)
    await sleep(10)
    expect(returned).toBe(1)
  })

  it('HTML: without streamed values, a cancellation serializes nothing more', () => {
    let reads = 0
    const pageContext = getPageContext({})
    Object.defineProperty(pageContext, 'data', {
      enumerable: true,
      get: () => (reads++, { plain: 1 }),
    })
    pageContext._passToClient = ['data']
    serializePageContextHtml(pageContext, null)
    const readsSerialized = reads
    cancelStreamedValuesHtml(pageContext)
    expect(reads).toBe(readsSerialized)
  })
})

describe('streamed pageContext values: edge cases', () => {
  it('a response that stops before its values ended fails the values that did not end', async () => {
    const reader = new Response('{"s":0,"v":1}\n').body!.getReader()
    const { pageContextFromServer } = readPageContextJson(
      '{"a":"!VikePromise:0","b":"!VikeStream:1","_streamedValues":[',
      '',
      reader,
      new TextDecoder(),
    )
    const pageContext = pageContextFromServer as any
    expect(await pageContext.a).toBe(1)
    await expect(readAll(pageContext.b)).rejects.toThrow('ended before')
  })

  it("client-side navigation: a producer that never waits doesn't block the event loop, even with a fast client", async () => {
    const { pageContext, cancel } = await navigation({
      g: (async function* () {
        while (true) yield 'x'
      })(),
    })
    const reading = readAll(pageContext.g).catch(() => {})
    await sleep(20)
    cancel()
    await reading
  })

  it('undefined values and chunks', async () => {
    const { pageContext } = await navigation({
      p: Promise.resolve(undefined),
      g: (async function* () {
        yield undefined
      })(),
    })
    expect(await pageContext.p).toBe(undefined)
    expect(await readAll(pageContext.g)).toEqual([undefined])
  })

  it('bytes starting with a byte order mark are kept', async () => {
    const bytes = Uint8Array.from([0xef, 0xbb, 0xbf, 0x61])
    const { pageContext } = await navigation({ s: streamOf([bytes]) })
    expect(await readAll(pageContext.s)).toEqual([bytes])
  })

  it('a consumer releasing a stream whose producer is slow releases the response right away', async () => {
    const onCancel = vi.fn()
    let pulls = 0
    const slow = new ReadableStream(
      {
        pull: (c) => (pulls++ === 0 ? c.enqueue(enc('first')) : new Promise(() => {})),
        cancel: onCancel,
      },
      { highWaterMark: 0 },
    )
    const { pageContext } = await navigation({ slow })
    const reader = pageContext.slow.getReader()
    await reader.read()
    await reader.cancel()
    await sleep(10)
    expect(onCancel).toHaveBeenCalled()
  })

  it('the values in a Map contained in a chunk that fails are cancelled', async () => {
    const onCancel = vi.fn()
    const pageContext = {}
    const { streamedValues } = serialize(
      { p: Promise.resolve({ fn() {}, m: new Map([['k', streamOf([], { onCancel })]]) }) },
      pageContext,
    )
    await pumpStreamedValues(pageContext, streamedValues, () => {}, { failFast: false, onError: () => {} }).done
    await sleep(0)
    expect(onCancel).toHaveBeenCalled()
  })

  it("a producer failing because it's cancelled isn't logged, and its late chunk's values are cancelled", async () => {
    const onError = vi.fn()
    const onCancel = vi.fn()
    const next = deferred<IteratorResult<unknown>>()
    const iterator = {
      [Symbol.asyncIterator]: () => iterator,
      next: () => next.promise,
      return: async () => ({ done: true as const, value: undefined }),
    }
    const pageContext = {}
    const { streamedValues } = serialize({ iterator }, pageContext)
    const pump = pumpStreamedValues(pageContext, streamedValues, () => {}, { failFast: false, onError })
    await sleep(0)
    pump.cancel()
    next.resolve({ done: false, value: { s: streamOf([], { onCancel }) } })
    await sleep(10)
    expect(onCancel).toHaveBeenCalled()

    const failingNext = deferred<IteratorResult<unknown>>()
    const failing = { [Symbol.asyncIterator]: () => failing, next: () => failingNext.promise }
    const pageContext2 = {}
    const { streamedValues: streamedValues2 } = serialize({ failing }, pageContext2)
    const pump2 = pumpStreamedValues(pageContext2, streamedValues2, () => {}, { failFast: false, onError })
    await sleep(0)
    pump2.cancel()
    failingNext.reject(new Error('cancelled'))
    await sleep(10)
    expect(onError).not.toHaveBeenCalled()
  })
})

describe('streamed pageContext values: the HTML response ending early cancels them', () => {
  const html = () =>
    new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(enc('<html>'))
      },
    })
  it('the HTML stream fails', async () => {
    const onCancel = vi.fn()
    let controller!: ReadableStreamDefaultController<Uint8Array>
    const failing = new ReadableStream<Uint8Array>({ start: (c) => void (controller = c) })
    controller.enqueue(enc('<html>'))
    const wrapper = (await processStream(failing, { onErrorWhileStreaming: () => {}, onCancel })) as ReadableStream
    wrapper.getReader().read()
    controller.error(new Error('HTML failed'))
    await sleep(10)
    expect(onCancel).toHaveBeenCalled()
  })
  it('a Web Stream Pipe: the writable fails', async () => {
    const onCancel = vi.fn()
    const pipe = (writable: WritableStream) =>
      void html()
        .pipeTo(writable)
        .catch(() => {})
    stampPipe(pipe, 'web-stream')
    const wrapper = (await processStream(pipe, { onErrorWhileStreaming: () => {}, onCancel })) as any
    const writable = new WritableStream({ write: () => Promise.reject(new Error('client gone')) })
    wrapper(writable)
    await sleep(10)
    expect(onCancel).toHaveBeenCalled()
  })
  it('a Node.js Stream Pipe: the writable closes', async () => {
    const onCancel = vi.fn()
    const pipe = (writable: any) => void writable.write('<html>')
    stampPipe(pipe, 'node-stream')
    const wrapper = (await processStream(pipe, { onErrorWhileStreaming: () => {}, onCancel })) as any
    const writable = new PassThrough()
    wrapper(writable)
    writable.destroy()
    await sleep(10)
    expect(onCancel).toHaveBeenCalled()
  })
  it('a Node.js Readable: the readable is destroyed', async () => {
    const onCancel = vi.fn()
    const readable = new Readable({ read() {} })
    readable.push('<html>')
    const wrapper = (await processStream(readable, { onErrorWhileStreaming: () => {}, onCancel })) as Readable
    wrapper.destroy()
    await sleep(10)
    expect(onCancel).toHaveBeenCalled()
  })
  it('a Web Stream piped to a Node.js writable: errors and closing are propagated', async () => {
    let controller!: ReadableStreamDefaultController<Uint8Array>
    const failing = new ReadableStream<Uint8Array>({ start: (c) => void (controller = c) })
    const writable = new PassThrough()
    writable.on('error', () => {})
    pipeToStreamWritableNode(failing, writable)
    await sleep(0)
    controller.error(new Error('HTML failed'))
    await sleep(10)
    expect(writable.destroyed).toBe(true)

    const onCancel = vi.fn()
    const source = new ReadableStream({ cancel: onCancel })
    const writable2 = new PassThrough()
    pipeToStreamWritableNode(source, writable2)
    await sleep(0)
    writable2.destroy()
    await sleep(10)
    expect(onCancel).toHaveBeenCalled()
  })
})
