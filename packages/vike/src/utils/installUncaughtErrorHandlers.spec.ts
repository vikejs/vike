import { expect, describe, it, beforeAll, afterAll, afterEach } from 'vitest'
import { spawn, type ChildProcess } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { build } from 'rolldown'

let tmpDir: string
let bundleFileUrl: string
beforeAll(async () => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vike-installUncaughtErrorHandlers-'))
  // Bundle installUncaughtErrorHandlers.ts so that it can be executed by a Node.js child process
  const bundleFile = path.join(tmpDir, 'installUncaughtErrorHandlers.mjs')
  await build({
    input: path.join(import.meta.dirname, 'installUncaughtErrorHandlers.ts'),
    output: { file: bundleFile, format: 'esm' },
    logLevel: 'silent',
  })
  bundleFileUrl = pathToFileURL(bundleFile).href
})
afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true })
})

const children: ChildProcess[] = []
afterEach(() => {
  children.forEach((child) => child.kill('SIGKILL'))
  children.length = 0
})

const poll = { timeout: 10 * 1000 }

describe('installUncaughtErrorHandlers()', () => {
  it('keeps the process alive upon uncaught errors', { timeout: 20 * 1000 }, async () => {
    const { child, output } = run(`
      setTimeout(() => { throw new Error('Some uncaught exception') }, 0)
      Promise.reject(new Error('Some unhandled rejection'))
      setTimeout(() => console.log('Still alive'), 100)
    `)
    await expect.poll(() => output.stdout, poll).toContain('Still alive')
    expect(output.stderr).toContain('Some uncaught exception')
    expect(output.stderr).toContain('Some unhandled rejection')
    // Exits normally once there is nothing left to do
    await expect.poll(() => child.exitCode, poll).toBe(0)
  })

  // https://github.com/vikejs/vike/issues/3577
  it('exits when stdout and stderr are broken', { timeout: 20 * 1000 }, async () => {
    const { child, output } = run(`
      setInterval(() => console.log('Some log'), 10)
    `)
    await expect.poll(() => output.stdout, poll).toContain('Some log')
    // Same as when the terminal is closed: writing to stdout/stderr fails
    child.stdout!.destroy()
    child.stderr!.destroy()
    // Otherwise the process never exits: console.error() fails and re-triggers the uncaughtException handler, endlessly
    await expect.poll(() => child.exitCode, poll).toBe(1)
  })

  it("doesn't exit if the user handles stdout errors", { timeout: 20 * 1000 }, async () => {
    const { child, output } = run(`
      let errorCount = 0
      process.stdout.on('error', () => {
        if (++errorCount === 3) console.error('Still alive')
      })
      setInterval(() => console.log('Some log'), 10)
    `)
    await expect.poll(() => output.stdout, poll).toContain('Some log')
    child.stdout!.destroy()
    await expect.poll(() => output.stderr, poll).toContain('Still alive')
    expect(child.exitCode).toBe(null)
  })
})

function run(code: string) {
  const child = spawn(
    process.execPath,
    [
      '--input-type=module',
      '--eval',
      `import { installUncaughtErrorHandlers } from ${JSON.stringify(bundleFileUrl)}\ninstallUncaughtErrorHandlers()\n${code}`,
    ],
    { stdio: ['ignore', 'pipe', 'pipe'] },
  )
  children.push(child)
  const output = { stdout: '', stderr: '' }
  child.stdout.on('data', (chunk) => (output.stdout += chunk))
  child.stderr.on('data', (chunk) => (output.stderr += chunk))
  return { child, output }
}
