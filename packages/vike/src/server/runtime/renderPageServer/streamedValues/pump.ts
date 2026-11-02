// Reads the streamed values of a response concurrently and writes their lines.
// - `failFast: false` (responses): a value that fails is logged and sent as an `error` line.
// - `failFast: true` (pre-rendering): a value that fails rejects `done`.

export { pumpStreamedValues }
export { catchStreamedPromises }

import type { Line } from '../../../../shared-server-client/streamedValues.js'
import { logRuntimeError, type PageContext_logRuntime } from '../../loggerRuntime.js'
import { getReplacer, type StreamedValue } from './registry.js'
import { serializeLine } from './lines.js'
import { genPromise } from '../../../../utils/genPromise.js'
import { isPlainObject } from '../../../../utils/isPlainObject.js'
import '../../../assertEnvServer.js'

function pumpStreamedValues(
  pageContext: NonNullable<PageContext_logRuntime>,
  streamedValues: StreamedValue[],
  write: (line: string) => void,
  { failFast }: { failFast: boolean },
): { done: Promise<void>; cancel: () => void } {
  // Stop the values being read: when the response ends early, or when the value fails
  const cancels = new Set<() => void>()
  let pending = 0
  let isEnded = false
  const { promise: done, resolve, reject } = genPromise({ timeout: null })

  const end = (settle: () => void) => {
    if (isEnded) return
    isEnded = true
    cancels.forEach((cancel) => cancel())
    settle()
  }

  const start = (streamedValue: StreamedValue) => {
    pending++
    send(streamedValue).then(
      () => {
        if (--pending === 0) end(resolve)
      },
      (err) => end(() => reject(err)),
    )
  }

  // A line's value can contain new streamed values: they're started after the line is written
  const writeLine = (line: Line) => {
    const { replacer, streamedValues } = getReplacer(pageContext)
    write(serializeLine(line, replacer))
    streamedValues.forEach(start)
  }

  const send = async ({ id: s, type, value }: StreamedValue) => {
    let cancel = () => {}
    try {
      const reader = type.read(value)
      cancel = () => void Promise.resolve(reader.cancel()).catch(() => {})
      cancels.add(cancel)
      while (true) {
        const result = await reader.next()
        if (isEnded) return
        const { line, isLast } = reader.toLine(result)
        writeLine({ s, ...line })
        if (isLast) return
      }
    } catch (err) {
      if (isEnded) return
      cancel()
      if (failFast) throw err
      logRuntimeError(err, pageContext)
      writeLine({ s, error: true })
    } finally {
      cancels.delete(cancel)
    }
  }

  streamedValues.forEach(start)
  return { done, cancel: () => end(resolve) }
}

// A promise is read only after pageContext is serialized (e.g. after the HTML is rendered), or never (e.g. upon
// `throw redirect()`): its error is logged as soon as it rejects.
// - Otherwise a promise that rejects before is an unhandled rejection
// - Only native promises: a thenable (e.g. a query builder) runs only once it's read
function catchStreamedPromises(value: unknown, pageContext: NonNullable<PageContext_logRuntime>): void {
  if (value instanceof Promise) {
    value.catch((err) => logRuntimeError(err, pageContext))
  } else if (Array.isArray(value)) {
    value.forEach((v) => catchStreamedPromises(v, pageContext))
  } else if (isPlainObject(value)) {
    Object.values(value).forEach((v) => catchStreamedPromises(v, pageContext))
  }
}
