// The types of streamed pageContext values (see shared-server-client/streamedValues.ts), and the receiver: its reviver
// replaces the markers with values, which it then feeds with their lines.

export { createReceiver }
export type { StreamedValueType }

import { parseTransform, type Reviver } from '@brillout/json-serializer/parse'
import type { Line } from '../../../shared-server-client/streamedValues.js'
import { assert } from '../../../utils/assert.js'
import { readableStream } from './readableStream.js'
import { promise } from './promise.js'
import { asyncIterable } from './asyncIterable.js'
import '../../assertEnvClient.js'

type StreamedValueType = {
  marker: string
  /** `parseValue()` parses the value of a `v` line, which can contain further streamed values */
  revive: (parseValue: (value: unknown) => unknown) => StreamedValue
}
type StreamedValue = { value: unknown; push: (line: Line) => void; fail: (err: unknown) => void }

const types = [readableStream, promise, asyncIterable]

function createReceiver() {
  const streamedValues = new Map<number, StreamedValue>()
  const parseValue = (value: unknown) => parseTransform(value, { reviver })
  const reviver: Reviver = (_path, value) => {
    const type = types.find((type) => value.startsWith(type.marker))
    if (!type) return undefined
    const id = value.slice(type.marker.length)
    assert(/^\d+$/.test(id))
    // The same value referenced twice
    let streamedValue = streamedValues.get(Number(id))
    if (!streamedValue) {
      streamedValue = type.revive(parseValue)
      streamedValues.set(Number(id), streamedValue)
    }
    return { replacement: streamedValue.value }
  }
  return {
    reviver,
    onLine(lineStr: string) {
      const line = JSON.parse(lineStr) as Line
      // Unknown if contained in a chunk nobody read
      streamedValues.get(line.s)?.push(line)
    },
    /** The response failed, ended or was cancelled: the values that didn't end fail */
    fail(err: unknown) {
      streamedValues.forEach((streamedValue) => streamedValue.fail(err))
    },
  }
}
