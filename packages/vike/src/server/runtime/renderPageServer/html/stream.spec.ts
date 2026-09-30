import {
  awaitFirstChunk,
  pipeToStreamWritableNode,
  processStream,
  stampPipe,
  streamReadableWebToBytes,
  type StreamPipeNode,
  type StreamPipeWeb,
} from './stream.js'
import { expect, describe, it } from 'vitest'
import { Readable, Writable } from 'node:stream'

describe('streamReadableWebToBytes', () => {
  it('concatenates the chunks without decoding them', async () => {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new Uint8Array([0x68, 0xc3]))
        controller.enqueue(new Uint8Array([]))
        controller.enqueue(new Uint8Array([0xa9, 0xff]))
        controller.close()
      },
    })
    expect(await streamReadableWebToBytes(stream)).toEqual(new Uint8Array([0x68, 0xc3, 0xa9, 0xff]))
  })
  it('rejects chunks that are not a Uint8Array', async () => {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue('hello')
        controller.close()
      },
    })
    await expect(streamReadableWebToBytes(stream)).rejects.toThrow("The stream emitted a chunk that isn't a Uint8Array")
  })
})

describe('awaitFirstChunk', () => {
  it('rejects if the stream errors before the first chunk', async () => {
    const stream = new ReadableStream({
      start(controller) {
        controller.error(new Error('Some error'))
      },
    })
    await expect(awaitFirstChunk(stream, () => {})).rejects.toThrow('Some error')
  })
  it('errors the stream if it errors after the first chunk', async () => {
    const errors: unknown[] = []
    let controller!: ReadableStreamDefaultController<Uint8Array>
    const stream = new ReadableStream<Uint8Array>({
      start(c) {
        controller = c
        controller.enqueue(new Uint8Array([1]))
      },
    })
    const reader = (await awaitFirstChunk(stream, (err) => errors.push(err))).getReader()
    expect((await reader.read()).value).toEqual(new Uint8Array([1]))
    controller.error(new Error('Some error'))
    await expect(reader.read()).rejects.toThrow('Some error')
    expect(errors).toEqual([new Error('Some error')])
  })
  it('reads on demand', async () => {
    let pulled = 0
    const stream = new ReadableStream<Uint8Array>(
      {
        pull(controller) {
          controller.enqueue(new Uint8Array([pulled++]))
        },
      },
      { highWaterMark: 0 },
    )
    const reader = (await awaitFirstChunk(stream, () => {})).getReader()
    await new Promise((r) => setTimeout(r, 10))
    expect(pulled).toBeLessThan(3)
    expect((await reader.read()).value).toEqual(new Uint8Array([0]))
    expect((await reader.read()).value).toEqual(new Uint8Array([1]))
  })
  it('cancels the original stream', async () => {
    let reason: unknown
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new Uint8Array([1]))
      },
      cancel(r) {
        reason = r
      },
    })
    await (await awaitFirstChunk(stream, () => {})).cancel('Some reason')
    expect(reason).toBe('Some reason')
  })
})

describe('processStream', () => {
  it('cancels the original Web stream', async () => {
    let reason: unknown
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new Uint8Array([1]))
      },
      cancel(r) {
        reason = r
      },
    })
    const streamWrapper = (await processStream(stream, { onErrorWhileStreaming() {} })) as ReadableStream
    await streamWrapper.cancel('Some reason')
    expect(reason).toBe('Some reason')
  })

  it("doesn't cancel react-streaming's Web stream (it throws on every later write)", async () => {
    let controller!: ReadableStreamDefaultController
    const readable = new ReadableStream({
      start(c) {
        controller = c
        c.enqueue(new Uint8Array([1]))
      },
    })
    const streamReactStreaming = { readable, pipe: null, injectToStream() {}, hasStreamEnded: () => false }
    const streamWrapper = (await processStream(streamReactStreaming as never, {
      onErrorWhileStreaming() {},
    })) as ReadableStream
    await streamWrapper.cancel()
    expect(() => controller.enqueue(new Uint8Array([2]))).not.toThrow()
  })

  it('stops the source if the response is already closed', async () => {
    const closedResponses = [new Writable().destroy(), new Writable().destroy()]
    await new Promise((r) => setTimeout(r)) // Let them emit 'close'
    let cancelled = false
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array([1]))
      },
      cancel() {
        cancelled = true
      },
    })
    pipeToStreamWritableNode(await processStream(stream, { onErrorWhileStreaming() {} }), closedResponses[0]!)
    let closed = false
    const pipe: StreamPipeNode = (writable) => {
      writable.write('a')
      writable.on('close', () => (closed = true))
    }
    stampPipe(pipe, 'node-stream')
    ;((await processStream(pipe, { onErrorWhileStreaming() {} })) as StreamPipeNode)(closedResponses[1]!)
    await new Promise((r) => setTimeout(r, 10))
    expect({ cancelled, closed }).toEqual({ cancelled: true, closed: true })
  })
})

describe('pipeToStreamWritableNode', () => {
  it('cancels the stream when the response closes early', async () => {
    let cancelled = false
    const stream = new ReadableStream({
      async pull(controller) {
        await new Promise((r) => setTimeout(r))
        controller.enqueue(new Uint8Array([1]))
      },
      cancel() {
        cancelled = true
      },
    })
    const response = new Writable({ write: (_chunk, _encoding, callback) => callback() })
    pipeToStreamWritableNode(await processStream(stream, { onErrorWhileStreaming() {} }), response)
    await new Promise((r) => setTimeout(r, 10))
    response.destroy()
    await new Promise((r) => setTimeout(r, 10))
    expect(cancelled).toBe(true)
  })

  it('stops Node.js Readable, Node.js pipe and Web pipe sources when the response closes early', async () => {
    const stopped: string[] = []
    const readable = new Readable({ read() {} })
    readable.push('a')
    readable.on('close', () => stopped.push('readable'))
    const pipeNode: StreamPipeNode = (writable) => {
      writable.write('a')
      writable.on('close', () => stopped.push('pipe node'))
    }
    stampPipe(pipeNode, 'node-stream')
    const pipeWeb: StreamPipeWeb = (writable) => {
      const writer = writable.getWriter()
      writer.write(new Uint8Array([1]))
      writer.closed.catch(() => stopped.push('pipe web'))
    }
    stampPipe(pipeWeb, 'web-stream')
    const opts = { onErrorWhileStreaming() {} }
    const responses = [new Writable({ write: (_c, _e, cb) => cb() }), new Writable({ write: (_c, _e, cb) => cb() })]
    pipeToStreamWritableNode(await processStream(readable, opts), responses[0]!)
    ;((await processStream(pipeNode, opts)) as StreamPipeNode)(responses[1]!)
    const { readable: responseWeb, writable } = new TransformStream()
    ;((await processStream(pipeWeb, opts)) as StreamPipeWeb)(writable)
    await new Promise((r) => setTimeout(r, 10))
    responses.forEach((response) => response.destroy())
    await responseWeb.cancel()
    await new Promise((r) => setTimeout(r, 10))
    expect(stopped.sort()).toEqual(['pipe node', 'pipe web', 'readable'])
  })

  it('destroys the response if the stream errors', async () => {
    let pulls = 0
    const stream = new ReadableStream({
      pull(controller) {
        if (pulls++ === 0) controller.enqueue(new Uint8Array([1]))
        else controller.error(new Error('Some error'))
      },
    })
    const response = new Writable({ write: (_chunk, _encoding, callback) => callback() })
    let err: unknown
    response.on('error', (e) => (err = e))
    pipeToStreamWritableNode(await awaitFirstChunk(stream, () => {}), response)
    await new Promise((r) => setTimeout(r, 10))
    expect((err as Error).message).toBe('Some error')
  })
})
