export { promise }

import { markers } from '../../../shared-server-client/streamedValues.js'
import { getLineError } from './lines.js'
import type { StreamedValueType } from './registry.js'
import { genPromise } from '../../../utils/genPromise.js'
import '../../assertEnvClient.js'

// Settled by its `v` or `error` line
const promise: StreamedValueType = {
  marker: markers.promise,
  revive(parseValue) {
    const { promise: value, resolve, reject } = genPromise<unknown>({ timeout: null })
    // Avoid an unhandled rejection if the user doesn't use the promise
    value.catch(() => {})
    return {
      value,
      push: (line) => ('v' in line ? resolve(parseValue(line.v)) : reject(getLineError())),
      fail: reject,
    }
  },
}
