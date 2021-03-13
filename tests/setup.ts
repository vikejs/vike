import { spawn } from 'child_process'
import { ChildProcessWithoutNullStreams } from 'child_process'
import { dirname as pathDirname } from 'path'
import { Page } from 'playwright-chromium'
import { sleep } from './utils'
import { red, bold, blue } from 'kolorist'

export { partRegExp } from './utils'
export { default as fetch } from 'node-fetch'
export const page: Page = (global as any).page as Page
export { RunProcess }
export { run }
export { stop }
export { autoRetry }

jest.setTimeout(60 * 1000)

type RunProcess = {
  proc: ChildProcessWithoutNullStreams
  cwd: string
  cmd: string
}
function run(cmd: string): Promise<RunProcess> {
  let resolve: (_: RunProcess) => void
  let reject: (err: string) => void
  const promise = new Promise<RunProcess>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })

  const { testPath } = expect.getState()
  const cwd = pathDirname(testPath)
  const proc = runCommand(cmd, cwd)

  const prefix = `[Run Start][${cwd}][${cmd}]`

  const stdout: string[] = []
  let hasError = false
  let hasStarted = false
  let runProcess: RunProcess
  proc.stdout.on('data', async (data) => {
    data = data.toString()
    stdout.push(data)
    if (data.startsWith('Server running at') && !hasError) {
      if (hasError) {
        reject(`${prefix} An error occurred.`)
      } else {
        await sleep(1000)
        hasStarted = true
        runProcess = { proc, cwd, cmd }
        resolve(runProcess)
      }
    }
  })
  const stderr: string[] = []
  proc.stderr.on('data', async (data) => {
    data = data.toString()
    stderr.push(data)
    if (data.includes('EADDRINUSE')) {
      forceLog('stderr', data)
      process.exit(1)
    }
  })
  proc.on('exit', async (code) => {
    if ([0, null].includes(code) && hasStarted) return
    stdout.forEach(forceLog.bind(null, 'stdout'))
    stderr.forEach(forceLog.bind(null, 'stderr'))
    forceLog(prefix, `Unexpected stop, exit code: ${code}`)
    await terminate(runProcess)
  })

  return promise
}
async function terminate(runProcess: RunProcess) {
  setTimeout(() => {
    process.exit(2)
  }, 10 * 1000)
  if (runProcess) {
    await stop(runProcess, 'SIGKILL')
  }
}

function stop(runProcess: RunProcess, signal = 'SIGINT') {
  const { cwd, cmd, proc } = runProcess

  const prefix = `[Run Stop][${cwd}][${cmd}]`

  let resolve: () => void
  let reject: (err: string) => void
  const promise = new Promise<void>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })

  proc.on('close', (code) => {
    if (code === 0 || code === null) {
      resolve()
    } else {
      reject(`${prefix} Terminated with non-0 error code ${code}`)
    }
  })
  process.kill(-proc.pid, signal)

  return promise
}

function runCommand(cmd: string, cwd: string) {
  const [command, ...args] = cmd.split(' ')
  return spawn(command, args, { cwd, detached: true })
}

function forceLog(std: 'stdout' | 'stderr' | string, str: string) {
  if (std === 'stderr') std = bold(red(std))
  if (std === 'stdout') std = bold(blue(std))
  process.stderr.write(`[${std}]${str}`)
}

async function autoRetry(test: () => void | Promise<void>): Promise<void> {
  const timeout = 10 * 1000
  const period = 100
  const numberOfTries = timeout / period
  let i = 0
  while (true) {
    try {
      await test()
      return
    } catch (err) {
      i = i + 1
      if (i > numberOfTries) {
        throw err
      }
    }
    await sleep(period)
  }
}
