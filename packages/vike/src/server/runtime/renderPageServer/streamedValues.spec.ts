import { describe, it, expect, vi, beforeEach } from 'vitest'
vi.mock('../../../client/assertEnvClient.js', () => ({}))
vi.mock('../loggerRuntime.js', () => ({ logRuntimeError: vi.fn() }))
import { stringify } from '@brillout/json-serializer/stringify'
import { getStreamedValuesSerializer } from './streamedValues.js'
import { getPageContextJson, getPageContextJsonFile } from './pageContextJson.js'
import {
  sendStreamedValuesInHtml,
  getStreamedValuesHtml,
  getStreamedValuesLinesPrerendered,
  writeStreamedValuesHtmlAtStreamEnd,
} from './html/streamedValuesHtml.js'
import { parsePageContextHtml } from '../../../client/shared/streamedValues.js'
import { readPageContextJson, cancelStreamedValues } from '../../../client/runtime-client-routing/streamedValues.js'
import { logRuntimeError } from '../loggerRuntime.js'

const enc = (s: string) => new TextEncoder().encode(s)
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
function streamOf(chunks: unknown[], opts: { onCancel?: () => void; errorAt?: number } = {}) {
  let i = 0
  return new ReadableStream<unknown>(
    {
      pull(c) {
        if (i === opts.errorAt) c.error(new Error('stream failed'))
        else if (i < chunks.length) c.enqueue(chunks[i++])
        else c.close()
      },
      cancel: () => opts.onCancel?.(),
    },
    { highWaterMark: 0 },
  )
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

// A server pageContext, as the HTML delivery reads it
const getPageContextHtml = ({ isPrerendering = false, cspNonce = null as null | string } = {}) =>
  ({ cspNonce, isPrerendering, _requestId: 1 }) as any
function serialize(obj: Record<string, unknown>, pageContext: object) {
  const { replacer, getStreamedValues } = getStreamedValuesSerializer(pageContext)
  return { serialized: stringify(obj, { replacer }), streamedValues: getStreamedValues() }
}

// Client-side navigation: the server's `.pageContext.json` body, read by the client
async function navigation(obj: Record<string, unknown>) {
  const pageContext = {}
  const { serialized, streamedValues } = serialize(obj, pageContext)
  const body = getPageContextJson(serialized, streamedValues, pageContext as any)
  if (typeof body === 'string') return { body, pageContext: JSON.parse(body) }
  const [forClient, forText] = body.tee()
  const pageContextFromServer = (await readPageContextJson(new Response(forClient))) as any
  return { pageContext: pageContextFromServer, text: new Response(forText).text() }
}

// First render: the server's `<script>` tags, run by the "browser", read by the client
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
  const g = globalThis as any
  g.self = globalThis
  delete g.__vike_streamed
  const pageContextServer = getPageContextHtml({ cspNonce: 'test-nonce' })
  const { serialized, streamedValues } = serialize(obj, pageContextServer)
  sendStreamedValuesInHtml(pageContextServer, streamedValues, null)
  const getHtml = async () => (await getStreamedValuesHtml(pageContextServer))!
  if (runScriptsFirst) {
    runScripts(await getHtml(), 'test-nonce')
    return { pageContext: parsePageContextHtml(serialized) as any, getHtml }
  }
  const pageContext = parsePageContextHtml(serialized) as any
  // The scripts run after the client runtime loaded
  getHtml().then((html) => runScripts(html, 'test-nonce'))
  return { pageContext, getHtml }
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

describe('client-side navigation', () => {
  it('round-trips every kind, nested and mixed, with exact bytes', async () => {
    const { pageContext, text } = await navigation(getValues())
    await expectValues(pageContext)
    expect(logRuntimeError).not.toHaveBeenCalled()
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

  it('a failing value fails alone; the error is logged, not sent', async () => {
    const { pageContext, text } = await navigation({
      rejected: Promise.reject(new Error('secret')),
      failing: streamOf([enc('a')], { errorAt: 1 }),
      nonSerializable: Promise.resolve({ fn: () => {} }),
      ok: Promise.resolve('ok'),
    })
    await expect(pageContext.rejected).rejects.toThrow('failed on the server-side')
    await expect(readAll(pageContext.failing)).rejects.toThrow('failed on the server-side')
    await expect(pageContext.nonSerializable).rejects.toThrow('failed on the server-side')
    expect(await pageContext.ok).toBe('ok')
    expect(logRuntimeError).toHaveBeenCalledTimes(3)
    expect(await text).not.toContain('secret')
  })

  it('a new rendering cancels the values on the server', async () => {
    const onCancel = vi.fn()
    const onReturn = vi.fn()
    async function* infinite() {
      try {
        while (true) {
          yield 'tick'
          await sleep(1)
        }
      } finally {
        onReturn()
      }
    }
    const pageContext = {}
    const { serialized, streamedValues } = serialize(
      { s: new ReadableStream({ pull: () => new Promise(() => {}), cancel: onCancel }), g: infinite() },
      pageContext,
    )
    const body = getPageContextJson(serialized, streamedValues, pageContext as any) as ReadableStream
    const pageContextFromServer = (await readPageContextJson(new Response(body))) as any
    cancelStreamedValues()
    await expect(readAll(pageContextFromServer.g)).rejects.toThrow('ended before')
    await sleep(10)
    expect(onCancel).toHaveBeenCalled()
    expect(onReturn).toHaveBeenCalled()
  })
})

describe('first render (HTML)', () => {
  it('round-trips every kind, with the CSP nonce, whether the scripts run before or after the client runtime', async () => {
    await expectValues((await firstRender(getValues())).pageContext)
    await expectValues((await firstRender(getValues(), { runScriptsFirst: true })).pageContext)
  })

  it("escapes </script> and <!-- (the script can't be broken out of)", async () => {
    const xss = '</script><script>alert(1)</script><!--  '
    const { pageContext, getHtml } = await firstRender({ p: Promise.resolve({ xss }), s: streamOf([enc(xss)]) })
    expect(await pageContext.p).toEqual({ xss })
    expect(new TextDecoder().decode((await readAll(pageContext.s))[0] as Uint8Array)).toBe(xss)
    expect(await getHtml()).not.toContain('</script><script>alert')
  })

  it('HTML stream: the values are written before </body> once the HTML stream ends, then as they are produced', async () => {
    let resolveLater!: (value: string) => void
    const later = new Promise<string>((resolve) => (resolveLater = resolve))
    const pageContext = getPageContextHtml()
    const { streamedValues } = serialize({ now: Promise.resolve('now'), later }, pageContext)
    sendStreamedValuesInHtml(pageContext, streamedValues, null)
    await sleep(0)
    const written: string[] = []
    const htmlEnd = writeStreamedValuesHtmlAtStreamEnd(pageContext, '<p>end</p></body></html>', (html) => {
      written.push(html)
    })
    expect(written).toHaveLength(1)
    expect(written[0]).toMatch(/^<p>end<\/p><script>.*now.*<\/script>$/)
    resolveLater('later')
    expect(await htmlEnd).toBe('</body></html>')
    expect(written).toHaveLength(2)
    expect(written[1]).toContain('later')
  })
})

describe('pre-rendering', () => {
  it('the HTML and index.pageContext.json have the same lines, read once', async () => {
    const pageContext = getPageContextHtml({ isPrerendering: true })
    const values = { s: streamOf([enc('a'), bytes]), p: Promise.resolve(1) }
    const { serialized, streamedValues } = serialize(values, pageContext)
    sendStreamedValuesInHtml(pageContext, streamedValues, null)
    const html = (await getStreamedValuesHtml(pageContext))!
    // The pageContext.json is serialized after the HTML: same ids
    const { serialized: serializedJson } = serialize(values, pageContext)
    expect(serializedJson).toBe(serialized)
    const lines = (await getStreamedValuesLinesPrerendered(pageContext))!
    expect(lines).toHaveLength(4)
    const json = JSON.parse(getPageContextJsonFile(serializedJson, lines))
    expect(json._streamedValues).toHaveLength(lines.length)
    expect(lines.every((line) => html.includes(JSON.stringify(line).slice(1, -1).replaceAll('/', '\\/')))).toBe(true)
  })

  it('a failing value fails the pre-rendering', async () => {
    const pageContext = getPageContextHtml({ isPrerendering: true })
    const { streamedValues } = serialize({ p: Promise.reject(new Error('boom')) }, pageContext)
    sendStreamedValuesInHtml(pageContext, streamedValues, null)
    await expect(getStreamedValuesLinesPrerendered(pageContext)).rejects.toThrow('boom')
  })
})
