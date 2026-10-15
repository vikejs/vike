import { describe, test, expect } from 'vitest'
import { spawn } from 'node:child_process'
import path from 'node:path'

// Windows doesn't have signals
describe.skipIf(process.platform === 'win32')('$ vike dev exits upon', () => {
  test(
    "SIGINT sent to the process group (Ctrl+C) — +serverEntry.ts doesn't listen to SIGINT",
    { timeout: 60 * 1000 },
    async () => {
      const dev = await startDev()
      process.kill(-dev.pid, 'SIGINT')
      expect(await dev.exited()).toBe('SIGINT')
    },
  )

  test(
    'SIGTERM sent to $ vike dev (e.g. $ kill) — +serverEntry.ts listens to SIGTERM (graceful shutdown)',
    { timeout: 60 * 1000 },
    async () => {
      const dev = await startDev()
      process.kill(dev.pid, 'SIGTERM')
      expect(await dev.exited()).toBe('SIGTERM')
    },
  )
})

async function startDev() {
  const proc = spawn(process.execPath, [path.join(__dirname, 'node_modules/vike/bin.js'), 'dev'], {
    cwd: __dirname,
    // Own process group, so that we can send a signal to the whole group (like Ctrl+C does)
    detached: true,
    env: { ...process.env, PORT: '3017' },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  const pid = proc.pid!
  let logs = ''
  proc.stdout.on('data', (chunk) => (logs += chunk))
  proc.stderr.on('data', (chunk) => (logs += chunk))
  // The signal (or exit code) that terminated `$ vike dev`
  const exitPromise = new Promise<string | number | null>((resolve) =>
    proc.on('exit', (code, signal) => resolve(signal ?? code)),
  )

  // Upon timeout, kill all processes (`$ vike dev` and the process running +serverEntry.ts)
  const withTimeout = <T>(promise: Promise<T>, seconds: number, errMsg: string) =>
    new Promise<T>((resolve, reject) => {
      const timeout = setTimeout(() => {
        process.kill(-pid, 'SIGKILL')
        reject(new Error(`${errMsg} after ${seconds} seconds. Logs:\n${logs}`))
      }, seconds * 1000)
      promise.then(resolve, reject).finally(() => clearTimeout(timeout))
    })

  const isReady = new Promise<void>((resolve, reject) => {
    proc.stdout.on('data', () => logs.includes('Server running at') && resolve())
    exitPromise.then((exit) => reject(new Error(`$ vike dev terminated prematurely (${exit}). Logs:\n${logs}`)))
  })
  await withTimeout(isReady, 30, "$ vike dev isn't ready")

  return { pid, exited: () => withTimeout(exitPromise, 10, "$ vike dev didn't exit") }
}
