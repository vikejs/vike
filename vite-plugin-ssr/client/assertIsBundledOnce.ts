import { assertWarning } from '../utils/assert'

const codeId = Math.random()
globalThis.__vite_plugin_ssr__codeId = globalThis.__vite_plugin_ssr__codeId || codeId

assertWarning(
  codeId === globalThis.__vite_plugin_ssr__codeId,
  'vite-plugin-ssr is included twice in your bundle, which should be avoided in order reduce KBs loaded by the browser',
  { onlyOnce: true }
)

declare global {
  var __vite_plugin_ssr__codeId: undefined | number
}
