import { expect, it } from 'vitest'
import { createRequire } from 'node:module'

type ProcessInternal = NodeJS.Process & { reallyExit?: unknown }

// https://github.com/vikejs/vike/issues/3577#issuecomment-6129563922
it("importing Rolldown doesn't install signal handlers", async () => {
  const getSignalListenerCounts = () =>
    (['SIGHUP', 'SIGINT', 'SIGTERM'] as const).map((signal) => process.listenerCount(signal))
  const signalListenerCountsBefore = getSignalListenerCounts()
  const { reallyExit } = process as ProcessInternal

  // Imports Rolldown
  await import('./transpileAndExecuteFile.js')

  expect(getSignalListenerCounts()).toEqual(signalListenerCountsBefore)
  expect((process as ProcessInternal).reallyExit).toBe(reallyExit)
  // Otherwise importRolldown() falls back to import(), which installs the signal handlers
  expect(() => createRequire(import.meta.url)('rolldown')).not.toThrow()
})
