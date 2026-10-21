export { asyncIterable }

import { markers } from '../../../shared-server-client/streamedValues.js'
import { readableStream } from './readableStream.js'
import type { StreamedValueType } from './registry.js'
import '../../assertEnvClient.js'

// A ReadableStream, consumed as an async iterable: `for await (const chunk of pageContext.someAsyncIterable)` (Safari's
// ReadableStream isn't async-iterable)
const asyncIterable: StreamedValueType = {
  marker: markers.asyncIterable,
  revive(parseValue) {
    const streamedValue = readableStream.revive(parseValue)
    return { ...streamedValue, value: toAsyncIterable(streamedValue.value as ReadableStream<unknown>) }
  },
}

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
