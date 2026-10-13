import { expect, it } from 'vitest'
import { importRolldown } from './importRolldown.js'

// https://github.com/vikejs/vike/issues/3577#issuecomment-6129563922
it('importRolldown() removes signal-exit', async () => {
  const signals = ['SIGHUP', 'SIGINT', 'SIGTERM'] as const
  const listenerCountsBefore = signals.map((sig) => process.listenerCount(sig))
  const { emit, reallyExit } = process as any
  const { rolldown } = await importRolldown()
  expect(typeof rolldown).toBe('function')
  // Ensure Rolldown did install signal-exit (otherwise this test is meaningless)
  expect((globalThis as any)[Symbol.for('signal-exit emitter')]).toBeDefined()
  expect((globalThis as any)[Symbol.for('signal-exit emitter')].count).toBe(0)
  expect(signals.map((sig) => process.listenerCount(sig))).toEqual(listenerCountsBefore)
  expect(process.emit).toBe(emit)
  expect((process as any).reallyExit).toBe(reallyExit)
  expect(await importRolldown()).toBe(await importRolldown())
})
