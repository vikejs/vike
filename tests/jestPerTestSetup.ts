import { spawn } from 'child_process'
import { ChildProcessWithoutNullStreams } from 'child_process'
import { dirname as pathDirname } from 'path'
import assert = require('assert')
import { partRegExp } from './utils'
import fetch from 'node-fetch'
import './test.d'

// @ts-ignore
global._page = global.page
// @ts-ignore
global._fetch = fetch
// @ts-ignore
global._partRegExp = partRegExp

beforeAll(async () => {
  await startServer()
  await _page.goto('http://localhost:3000')
})

afterAll(async () => {
  await stopServer()
})

let runningServer: null | {
  proc: ChildProcessWithoutNullStreams
  cwd: string
  cmd: string
} = null
function startServer() {
  let resolve: () => void
  let reject: (err: string) => void
  const promise = new Promise<void>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })

  const { testPath } = expect.getState()
  const cwd = pathDirname(testPath)
  const cmd = 'npm run dev'
  const proc = runCommand(cmd, cwd)

  assert(runningServer === null)
  runningServer = { proc, cwd, cmd }

  const prefix = `[Server Start][${cwd}][${cmd}]`

  let hasError = false
  proc.stdout.on('data', (data) => {
    data = data.toString()
    if (data.startsWith('Server running at') && !hasError) {
      if (hasError) {
        reject(`${prefix} An error occurred while starting the server.`)
      } else {
        resolve()
      }
    }
  })
  proc.stderr.on('data', (data) => {
    data = data.toString()
    hasError = true
    process.stderr.write(data)
  })
  proc.on('exit', (code) => {
    runningServer = null
    reject(`${prefix} Server did not start, exit code: ${code}`)
  })

  return promise
}
function stopServer() {
  if (!runningServer) return

  const { cwd, cmd, proc } = runningServer

  const prefix = `[Server Stop][${cwd}][${cmd}]`

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
      reject(`${prefix} Server terminated with non-0 error code ${code}`)
    }
  })
  process.kill(-proc.pid, 'SIGINT')

  return promise
}

function runCommand(cmd: string, cwd: string) {
  const [command, ...args] = cmd.split(' ')
  return spawn(command, args, { cwd, detached: true })
}
