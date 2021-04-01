import { spawn, exec } from 'child_process'
import { ChildProcessWithoutNullStreams } from 'child_process'
import { dirname as pathDirname } from 'path'
import { ConsoleMessage, Page } from 'playwright-chromium'
import { sleep } from './utils'
import { red, bold, blue } from 'kolorist'
import fetch from 'node-fetch'

export const urlBase = 'http://localhost:3000'
export { partRegExp } from './utils'
export const page: Page = (global as any).page as Page
export { autoRetry }
export { fetchHtml }
export { run }

const browserLogs: { type: string; text: string }[] = []
function run(cmd: string) {
  jest.setTimeout(60 * 1000)

  let runProcess: RunProcess
  beforeAll(async () => {
    runProcess = await start(cmd)
    page.on('console', onConsole)
    await page.goto(urlBase)
  })
  afterAll(async () => {
    page.off('console', onConsole)
    expect(browserLogs.filter(({ type }) => type === 'error')).toEqual([])
    browserLogs.length = 0
    await stop(runProcess)
  })
}
function onConsole(msg: ConsoleMessage) {
  const type = msg.type()
  const text = msg.text()
  browserLogs.push({
    type,
    text
  })
}

type RunProcess = {
  proc: ChildProcessWithoutNullStreams
  cwd: string
  cmd: string
}
async function start(cmd: string): Promise<RunProcess> {
  let resolve: (_: RunProcess) => void
  let reject: (err: string) => void
  const promise = new Promise<RunProcess>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })

  // Kill any process that listens to port `3000`
  await runCommand('fuser -k 3000/tcp')

  const { testPath } = expect.getState()
  const cwd = pathDirname(testPath)
  const proc = startProcess(cmd, cwd)

  const prefix = `[Run Start][${cwd}][${cmd}]`

  const stdout: string[] = []
  let hasError = false
  let hasStarted = false
  let runProcess: RunProcess
  proc.stdout.on('data', async (data: string) => {
    data = data.toString()
    stdout.push(data)
    if (
      (data.startsWith('Server running at') ||
        data.includes('Accepting connections at')) &&
      !hasError
    ) {
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

function startProcess(cmd: string, cwd: string) {
  const [command, ...args] = cmd.split(' ')
  return spawn(command, args, { cwd, detached: true })
}

function forceLog(std: 'stdout' | 'stderr' | string, str: string) {
  if (std === 'stderr') std = bold(red(std))
  if (std === 'stdout') std = bold(blue(std))
  process.stderr.write(`[${std}]${str}`)
}

async function autoRetry(test: () => void | Promise<void>): Promise<void> {
  const timeout = 60 * 1000
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

async function fetchHtml(pathname: string) {
  const response = await fetch(urlBase + pathname)
  const html = await response.text()
  return html
}

function runCommand(cmd: string) {
  const { promise, resolvePromise } = genPromise<void>()

  const timeout = setTimeout(() => {
    console.error(`Command call ${cmd} is hanging.`)
    process.exit()
  }, 5 * 1000)

  const options = {}
  exec(cmd, options, (err, _stdout, _stderr) => {
    clearTimeout(timeout)
    if (err) {
      // Swallow error
      resolvePromise()
    } else {
      resolvePromise()
    }
  })

  return promise
}

function genPromise<T>() {
  let resolvePromise!: (value?: T) => void
  let rejectPromise!: (value?: T) => void
  const promise: Promise<T> = new Promise((resolve, reject) => {
    resolvePromise = resolve
    rejectPromise = reject
  })
  return { promise, resolvePromise, rejectPromise }
}
