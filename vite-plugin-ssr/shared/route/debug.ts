export { debug }

// Note how we only import `type`: we don't actually import/load the debug code.
import type { createDebugger, Debug } from '../../utils/debug.js'

var _debug: undefined | typeof debug
function debug(...args: Parameters<Debug>) {
  if (!_debug) {
    // We use this trick instead of `import { createDebugger } from '../../utils/debug` in order to ensure that the `debug` mechanism is only loaded on the server-side
    _debug = (
      globalThis as any as { __brillout_debug_createDebugger?: typeof createDebugger }
    ).__brillout_debug_createDebugger?.('vps:routing')
  }
  if (_debug) {
    _debug(...args)
  }
}
