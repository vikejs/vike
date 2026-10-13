export { importRolldown }

import { getGlobalObject } from '../../../../utils/getGlobalObject.js'
import { createDebug } from '../../../../utils/debug.js'
import '../../assertEnvVite.js'

type Rolldown = typeof import('rolldown')

const globalObject = getGlobalObject('vite/shared/resolveVikeConfigInternal/importRolldown.ts', {
  rolldownPromise: null as null | Promise<Rolldown>,
})
const debugResolve = createDebug('vike:transpile-resolve')

// Importing `rolldown` installs signal-exit, which hijacks the signal handling of the whole process (e.g. SIGHUP): we remove it.
// - With signal-exit, closing the terminal of a dev server that has a debugger attached (`--inspect`) doesn't kill the server: it waits for the debugger to disconnect while keeping its ports.
// - Rolldown only uses signal-exit to flush its debug traces.
// - If another library (e.g. Vite 8) already imported `rolldown` then this is a no-op.
// https://github.com/vikejs/vike/issues/3577#issuecomment-6129563922
function importRolldown(): Promise<Rolldown> {
  globalObject.rolldownPromise ??= (async () => {
    const signalExitRemover = getSignalExitRemover()
    const rolldown = await import('rolldown')
    signalExitRemover()
    if (debugResolve.isActivated) debugResolve('rolldown version', rolldown.VERSION)
    return rolldown
  })()
  return globalObject.rolldownPromise
}

function getSignalExitRemover() {
  // https://github.com/tapjs/signal-exit/blob/main/src/index.ts
  const kExitEmitter = Symbol.for('signal-exit emitter')
  const getEmitterCount = () => (globalThis as any)[kExitEmitter]?.count ?? 0
  const emitterCountBefore: number = getEmitterCount()
  const { emit, reallyExit } = process as any
  const listenersBefore = getSignalListeners()
  return () => {
    const emitterCountDiff = getEmitterCount() - emitterCountBefore
    if (emitterCountDiff <= 0) return
    getSignalListeners().forEach(({ sig, listener }) => {
      if (!listenersBefore.some((l) => l.sig === sig && l.listener === listener)) process.removeListener(sig, listener)
    })
    const proc = process as any
    proc.emit = emit
    proc.reallyExit = reallyExit
    ;(globalThis as any)[kExitEmitter].count -= emitterCountDiff
  }
}

function getSignalListeners() {
  return process
    .eventNames()
    .filter((sig): sig is NodeJS.Signals => typeof sig === 'string' && sig.startsWith('SIG'))
    .flatMap((sig) => process.listeners(sig).map((listener) => ({ sig, listener })))
}
