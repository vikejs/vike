export { debug }

import type { createDebugger, Debug } from '../../utils/debug'

var _debug: undefined | typeof debug
function debug(...args: Parameters<Debug>) {
  if (!_debug) {
    // We use this trick instead of `import { createDebugger } from '../../utils/debug` in order to ensure that the `debug` mechanism is only loaded on the server-side
    _debug = (
      globalThis as any as { __vite_plugin_ssr_createDebugger?: typeof createDebugger }
    ).__vite_plugin_ssr_createDebugger?.('vps:routing')
  }
  if (_debug) {
    _debug(...args)
  }
}
