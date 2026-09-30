// The types of streamed pageContext values (see shared-server-client/streamedValues.ts), and the serializer's replacer
// that replaces them with their marker and id.

export { getStreamedValuesSerializer }
export { getReplacer }
export type { StreamedValue }
export type { StreamedValueType }

import type { Replacer } from '@brillout/json-serializer/stringify'
import type { LineContent } from '../../../../shared-server-client/streamedValues.js'
import { readableStream } from './readableStream.js'
import { promise } from './promise.js'
import { asyncIterable } from './asyncIterable.js'
import '../../../assertEnvServer.js'

type StreamedValueType<Value = any, Result = any> = {
  marker: string
  is: (value: unknown) => value is Value
  read: (value: Value) => {
    next: () => Promise<Result>
    /** `isLast`: the value ended */
    toLine: (result: Result) => { line: LineContent; isLast: boolean }
    cancel: () => unknown
  }
}
type StreamedValue = { id: number; type: StreamedValueType; value: unknown }

// A ReadableStream is also an async iterable
const types: StreamedValueType[] = [readableStream, promise, asyncIterable]

// Per pageContext: the HTML and the `index.pageContext.json` of a pre-rendered page reference the same values with the
// same ids.
const idsByPageContext = new WeakMap<object, { byValue: Map<unknown, StreamedValue>; idNext: number }>()
function getReplacer(pageContext: object, onValue: (streamedValue: StreamedValue) => void): Replacer {
  let ids = idsByPageContext.get(pageContext)
  if (!ids) idsByPageContext.set(pageContext, (ids = { byValue: new Map(), idNext: 0 }))
  return (_key, value) => {
    const type = types.find((type) => type.is(value))
    if (!type) return undefined
    let streamedValue = ids.byValue.get(value)
    if (!streamedValue) {
      streamedValue = { id: ids.idNext++, type, value }
      ids.byValue.set(value, streamedValue)
    }
    onValue(streamedValue)
    return { replacement: type.marker + streamedValue.id, resolved: true }
  }
}

// `streamedValues` is filled while serializing
function getStreamedValuesSerializer(pageContext: object) {
  const streamedValues: StreamedValue[] = []
  const replacer = getReplacer(pageContext, (streamedValue) => streamedValues.push(streamedValue))
  return { replacer, streamedValues }
}
