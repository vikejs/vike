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

const TIMEOUT = (process.env.CI ? 300 : 100) * 1000

const browserLogs: {
  type: string
  text: string
  location: any
  args: any
}[] = []
function run(cmd: string, baseUrl = '') {
  jest.setTimeout(TIMEOUT)

  let runProcess: RunProcess
  beforeAll(async () => {
    runProcess = await start(cmd)
    page.on('console', onConsole)
    page.setDefaultTimeout(TIMEOUT)
    await bailOnTimeout(async () => {
      await page.goto(urlBase + baseUrl)
    })
  })
  afterAll(async () => {
    page.off('console', onConsole)
    expect(browserLogs.filter(({ type }) => type === 'error')).toEqual([])
    browserLogs.length = 0
    await page.close() // See https://github.com/vitejs/vite/pull/3097
    await terminate(runProcess, 'SIGINT')
  })
}
function onConsole(msg: ConsoleMessage) {
  browserLogs.push({
    type: msg.type(),
    text: msg.text(),
    location: msg.location(),
    args: msg.args()
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
    resolve = (...args) => {
      clearTimeout(timeout)
      _resolve(...args)
    }
    reject = (...args) => {
      clearTimeout(timeout)
      _reject(...args)
    }
  })
  const timeout = setTimeout(() => {
    console.error(`Npm script ${cmd} is hanging.`)
    process.exit(1)
  }, TIMEOUT)

  // Kill any process that listens to port `3000`
  if (!process.env.CI && process.platform === 'linux') {
    await runCommand('fuser -k 3000/tcp')
  }

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
    if ((data.startsWith('Server running at') || data.includes('Accepting connections at')) && !hasError) {
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
    if (([0, null].includes(code) || (code === 1 && process.platform === 'win32')) && hasStarted) return
    stdout.forEach(forceLog.bind(null, 'stdout'))
    stderr.forEach(forceLog.bind(null, 'stderr'))
    forceLog(prefix, `Unexpected process termination, exit code: ${code}`)
    await terminate(runProcess, 'SIGKILL')
  })

  return promise
}
async function terminate(runProcess: RunProcess, signal: 'SIGINT' | 'SIGKILL') {
  const timeout = setTimeout(() => {
    console.error('Process termination timeout.')
    process.exit(1)
  }, TIMEOUT)
  if (runProcess) {
    await stopProcess(runProcess, signal)
    clearTimeout(timeout)
  }
}

function stopProcess(runProcess: RunProcess, signal: 'SIGINT' | 'SIGKILL') {
  const { cwd, cmd, proc } = runProcess

  const prefix = `[Run Stop][${cwd}][${cmd}]`

  let resolve: () => void
  let reject: (err: string) => void
  const promise = new Promise<void>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })

  const onProcessClose = (code: number) => {
    if (code === 0 || code === null || (code === 1 && process.platform === 'win32')) {
      resolve()
    } else {
      reject(`${prefix} Terminated with non-0 error code ${code}`)
    }
  }
  proc.on('close', onProcessClose)
  proc.on('exit', onProcessClose)
  if (process.platform === 'win32') {
    // - https://github.com/nodejs/node/issues/3617#issuecomment-377731194
    // - https://stackoverflow.com/questions/23706055/why-can-i-not-kill-my-child-process-in-nodejs-on-windows/28163919#28163919
    spawn('taskkill', ['/pid', String(proc.pid), '/f', '/t'], { stdio: ['ignore', 'ignore', 'inherit'] })
  } else {
    process.kill(-proc.pid, signal)
  }

  return promise
}

function startProcess(cmd: string, cwd: string) {
  let [command, ...args] = cmd.split(' ')
  let detached = true
  if (process.platform === 'win32') {
    detached = false
    if (command === 'npm') {
      command = 'npm.cmd'
    }
  }
  return spawn(command, args, { cwd, detached })
}

function forceLog(std: 'stdout' | 'stderr' | string, str: string) {
  if (std === 'stderr') std = bold(red(std))
  if (std === 'stdout') std = bold(blue(std))
  process.stderr.write(`[${std}]${str}`)
}

async function autoRetry(test: () => void | Promise<void>): Promise<void> {
  const period = 100
  const numberOfTries = TIMEOUT / period
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
    process.exit(1)
  }, TIMEOUT)

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

async function bailOnTimeout(asyncFunc: () => Promise<void>) {
  const timeout = setTimeout(() => {
    console.error(`Function timeout.`)
    process.exit(1)
  }, 30 * 1000)
  await asyncFunc()
  clearTimeout(timeout)
}
