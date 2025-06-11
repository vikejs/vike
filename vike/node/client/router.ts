export { navigate }
export { reload }
export { prefetch }
export { onPopState }

import { assertWarning } from '../../utils/assert.js'

// `never` to ensure package.json#exports["./client/router"].types points to type defined by the client-side code
const navigate: never = (() => warnNoEffect('navigate')) as never
const reload: never = (() => warnNoEffect('reload')) as never
const prefetch: never = (() => warnNoEffect('prefetch')) as never
const onPopState: never = (() => {}) as never

function warnNoEffect(caller: string) {
  assertWarning(false, `Calling ${caller}() on the server-side has no effect`, {
    showStackTrace: true,
    onlyOnce: false,
  })
}
