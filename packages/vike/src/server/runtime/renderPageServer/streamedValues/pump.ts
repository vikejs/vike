// Reads the streamed values of a response concurrently and writes their lines.
// - `failFast: false` (responses): a value that fails is logged and sent as an `error` line.
// - `failFast: true` (pre-rendering): a value that fails rejects `done`.

export { pumpStreamedValues }

import type { Line } from '../../../../shared-server-client/streamedValues.js'
import { logRuntimeError, type PageContext_logRuntime } from '../../loggerRuntime.js'
import { getReplacer, type StreamedValue } from './registry.js'
import { serializeLine } from './lines.js'
import '../../../assertEnvServer.js'

function pumpStreamedValues(
  pageContext: NonNullable<PageContext_logRuntime>,
  streamedValues: StreamedValue[],
  write: (line: string) => void,
  { failFast }: { failFast: boolean },
): { done: Promise<void>; cancel: () => void } {
  const started = new Set<unknown>()
  // Stop the values being read: when the response ends early, or when the value fails
  const cancels = new Set<() => void>()
  let pending = 0
  let isEnded = false
  let resolve!: () => void
  let reject!: (err: unknown) => void
  const done = new Promise<void>((resolve_, reject_) => {
    resolve = resolve_
    reject = reject_
  })

  const end = (settle: () => void) => {
    if (isEnded) return
    isEnded = true
    cancels.forEach((cancel) => cancel())
    settle()
  }

  const start = (streamedValue: StreamedValue) => {
    // The same value referenced twice is sent once (a stream can be read only once)
    if (started.has(streamedValue.value) || isEnded) return
    started.add(streamedValue.value)
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
  if (pending === 0) end(resolve)
  return { done, cancel: () => end(resolve) }
}
