import { createHttpResponsePageContent } from './createHttpResponse.js'
import type { RenderHook } from './execHookOnRenderHtml.js'
import { awaitFirstChunk } from './html/stream.js'
import { expect, describe, it } from 'vitest'
import { Writable } from 'node:stream'

const renderHook = {
  hookName: 'onRenderHtml',
  hookFilePath: '/pages/feed/+onRenderHtml.ts',
} as RenderHook

function createPageContext(urlOriginal: string, headersResponse = new Headers()) {
  return {
    urlOriginal,
    pageId: '/pages/feed',
    is404: null,
    errorWhileRendering: null,
    __getPageAssets: async () => [],
    _globalContext: { _pageConfigs: [] } as any,
    headersResponse,
    pageContextsAborted: [],
  }
}

// Not valid UTF-8
const bytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x00, 0xff, 0xfe, 0x80, 0xc3])

describe('createHttpResponsePageContent', () => {
  it('Content-Type from the URL', () => {
    const httpResponse = createHttpResponsePageContent('<feed/>', renderHook, createPageContext('/feed.atom'))
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.headers).toEqual([['Content-Type', 'application/atom+xml;charset=utf-8']])
    expect(httpResponse.earlyHints).toEqual([])
    expect(httpResponse.body).toBe('<feed/>')
  })

  it('headersResponse overrides the Content-Type', () => {
    const headersResponse = new Headers({ 'content-type': 'application/feed+json', 'cache-control': 'no-store' })
    const httpResponse = createHttpResponsePageContent(
      '{}',
      renderHook,
      createPageContext('/feed.json', headersResponse),
    )
    expect(httpResponse.headers).toEqual([
      ['cache-control', 'no-store'],
      ['content-type', 'application/feed+json'],
    ])
  })

  it('Uint8Array', async () => {
    const pageContext = createPageContext('/image.png')
    const get = () => createHttpResponsePageContent(bytes, renderHook, pageContext)
    expect(get().headers).toEqual([['Content-Type', 'image/png']])
    expect(await readWeb(get().getReadableWebStream())).toEqual(bytes)
    expect(await readNode(await get().getReadableNodeStream())).toEqual(bytes)
    expect(await pipeNode(get())).toEqual(bytes)
    expect(await pipeWeb(get())).toEqual(bytes)
    await expect(get().getBody()).rejects.toThrow("pageContext.httpResponse.getBody() can't be used")
    const text = new TextEncoder().encode('Café')
    expect(await createHttpResponsePageContent(text, renderHook, pageContext).getBody()).toBe('Café')
    expect(() => get().body).toThrow("pageContext.httpResponse.body can't be used")
  })

  it('ReadableStream', async () => {
    const get = async () => {
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(bytes.slice(0, 5))
          controller.enqueue(bytes.slice(5))
          controller.close()
        },
      })
      const content = await awaitFirstChunk(stream, () => {})
      return createHttpResponsePageContent(content, renderHook, createPageContext('/stream.txt'))
    }
    expect((await get()).headers).toEqual([['Content-Type', 'text/plain;charset=utf-8']])
    expect(await readWeb((await get()).getReadableWebStream())).toEqual(bytes)
    expect(await readNode(await (await get()).getReadableNodeStream())).toEqual(bytes)
    expect(await pipeNode(await get())).toEqual(bytes)
    expect(await pipeWeb(await get())).toEqual(bytes)
  })

  it('ReadableStream: an early-closed Node writable cancels the stream', async () => {
    let cancelled = false
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(bytes)
      },
      cancel() {
        cancelled = true
      },
    })
    const content = await awaitFirstChunk(stream, () => {})
    const httpResponse = createHttpResponsePageContent(content, renderHook, createPageContext('/stream.txt'))
    const writable = new Writable({
      write(_chunk, _encoding, callback) {
        callback()
        writable.destroy()
      },
    })
    httpResponse.pipe(writable)
    await new Promise((r) => setTimeout(r, 50))
    expect(cancelled).toBe(true)
  })
})

async function readWeb(stream: ReadableStream): Promise<Uint8Array> {
  const chunks: Uint8Array[] = []
  for await (const chunk of stream as any as AsyncIterable<Uint8Array>) chunks.push(chunk)
  return concat(chunks)
}
async function readNode(stream: NodeJS.ReadableStream): Promise<Uint8Array> {
  const chunks: Uint8Array[] = []
  for await (const chunk of stream) chunks.push(chunk as Uint8Array)
  return concat(chunks)
}
function pipeNode(httpResponse: ReturnType<typeof createHttpResponsePageContent>): Promise<Uint8Array> {
  const chunks: Uint8Array[] = []
  return new Promise((resolve) => {
    const writable = new Writable({
      write(chunk, _encoding, callback) {
        chunks.push(chunk)
        callback()
      },
      final(callback) {
        resolve(concat(chunks))
        callback()
      },
    })
    httpResponse.pipe(writable)
  })
}
function pipeWeb(httpResponse: ReturnType<typeof createHttpResponsePageContent>): Promise<Uint8Array> {
  const chunks: Uint8Array[] = []
  return new Promise((resolve) => {
    httpResponse.pipe(
      new WritableStream({
        write(chunk) {
          chunks.push(chunk)
        },
        close() {
          resolve(concat(chunks))
        },
      }),
    )
  })
}
function concat(chunks: Uint8Array[]): Uint8Array {
  const result = new Uint8Array(chunks.reduce((len, chunk) => len + chunk.length, 0))
  let offset = 0
  for (const chunk of chunks) {
    result.set(new Uint8Array(chunk), offset)
    offset += chunk.length
  }
  return result
}
