export { promise }

import { markers } from '../../../shared-server-client/streamedValues.js'
import { getLineError } from './lines.js'
import type { StreamedValueType } from './registry.js'
import '../../assertEnvClient.js'

// Settled by its `v` or `error` line
const promise: StreamedValueType = {
  marker: markers.promise,
  revive(parseValue) {
    let resolve!: (value: unknown) => void
    let reject!: (err: unknown) => void
    const value = new Promise((resolve_, reject_) => {
      resolve = resolve_
      reject = reject_
    })
    // Avoid an unhandled rejection if the user doesn't use the promise
    value.catch(() => {})
    return {
      value,
      push: (line) => ('v' in line ? resolve(parseValue(line.v)) : reject(getLineError())),
      fail: reject,
    }
  },
}
