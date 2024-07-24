export { createWriteOnlyStream }

import { Duplex, Writable, type WritableOptions } from 'stream'

/**
 * Creates a write-only stream that forwards all writes to a Duplex stream.
 *
 * @param duplex - The Duplex stream to write to.
 * @param options - Options for the Writable stream.
 * @returns A Writable stream that only allows writing operations.
 */
function createWriteOnlyStream(duplex: Duplex, options?: WritableOptions): Writable {
  let drainCallback: (() => void) | undefined

  // Handle backpressure by listening to the 'drain' event
  duplex.on('drain', () => {
    if (drainCallback) {
      const callback = drainCallback
      drainCallback = undefined
      callback()
    }
  })

  return new Writable({
    ...options,
    write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
      if (!duplex.write(chunk, encoding)) {
        drainCallback = callback
      } else {
        callback()
      }
    },
    final(callback: (error?: Error | null) => void): void {
      duplex.end(callback)
    }
  })
}
