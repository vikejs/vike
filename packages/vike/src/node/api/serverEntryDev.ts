export { startServerEntry_parent }
export { startServerEntry_child }
export { getServerEntryFilePath_ifDevCli }
export { getServerEntryViteServer }
export { isServerChildProcess }

// `$ vike dev` runs +serverEntry.js (if there isn't +server.js) — https://vike.dev/serverEntry
// - The parent process (`$ vike dev`) runs +serverEntry.js in a child process, and restarts the child process whenever a file imported by +serverEntry.js changes
// - The child process creates Vite's development server (in middleware mode) and runs +serverEntry.js using Vite's module runner
//   - createDevMiddleware() returns that Vite development server

import { fork, type ChildProcess } from 'node:child_process'
import path from 'node:path'
import { normalizePath, type EnvironmentModuleNode, type ViteDevServer } from 'vite'
import pc from '@brillout/picocolors'
import { getVikeConfigInternal } from '../vite/shared/resolveVikeConfigInternal.js'
import { getServerEntryFilePath_ifDev } from '../vite/plugins/pluginUniversalDeploy/getServerConfig.js'
import { isVikeCli } from '../cli/context.js'
import { onPlusMiddlewareChange } from '../../server/runtime/plusMiddlewareChange.js'
import { assert, assertInfo, assertUsage } from '../../utils/assert.js'
import { getGlobalObject } from '../../utils/getGlobalObject.js'
import { isRunnableDevEnvironment } from '../../utils/isRunnableDevEnvironment.js'
import './assertEnvApiDev.js'
const globalObject = getGlobalObject<{ viteServer?: ViteDevServer }>('api/serverEntryDev.ts', {})

const IS_SERVER_CHILD_PROCESS = '__VIKE_IS_SERVER_CHILD_PROCESS'
// The child process exits with this code to tell the parent process to restart it
const EXIT_CODE_RESTART = 33

// Parent process — child_process.fork()
function startServerEntry_parent(): Promise<never> {
  const [scriptPath, ...args] = process.argv.slice(1)
  assert(scriptPath)
  let child: ChildProcess
  let signalReceived: NodeJS.Signals | undefined
  const forkChild = () => {
    child = fork(scriptPath, args, { stdio: 'inherit', env: { ...process.env, [IS_SERVER_CHILD_PROCESS]: '1' } })
    child.on('exit', (code, signal) => {
      if (code === EXIT_CODE_RESTART && !signalReceived) forkChild()
      else exitLikeChild(code, signal ?? signalReceived ?? null)
    })
  }
  const onSignal = (signal: NodeJS.Signals) => {
    signalReceived = signal
    child.kill(signal)
  }
  process.on('SIGINT', onSignal)
  process.on('SIGTERM', onSignal)
  forkChild()
  // The parent process exits when the child process exits
  return new Promise<never>(() => {})
}

// Exit with the same exit code or signal as the child process
function exitLikeChild(code: number | null, signal: NodeJS.Signals | null): void {
  if (signal) {
    process.removeAllListeners(signal)
    process.kill(process.pid, signal)
  } else {
    process.exit(code ?? 1)
  }
}

// Child process — viteServer.ssrLoadModule()
async function startServerEntry_child(viteServer: ViteDevServer, serverEntryFilePath: string): Promise<void> {
  globalObject.viteServer = viteServer
  const { ssr } = viteServer.environments
  assertUsage(
    isRunnableDevEnvironment(ssr),
    `${pc.cyan('$ vike dev')} cannot run +serverEntry.js because Vite's ${pc.cyan('ssr')} environment isn't runnable`,
  )
  // Restart when +serverEntry.js or a file it imports changes
  restartOnFileChange(viteServer, (filePath) =>
    isImportedBy(ssr.moduleGraph.getModulesByFile(filePath), serverEntryFilePath),
  )
  // +serverEntry.js applies `globalContext.middlewares` itself: it holds the list it got
  onPlusMiddlewareChange(() => restart(`${pc.cyan('+middleware')} changed`))
  // The user's server uses the current Vite development server (e.g. `app.use(devMiddleware)`) => we restart the process instead of letting Vite restart itself (e.g. upon vite.config.js changes)
  viteServer.restart = async () => restart('Vite needs to restart')

  try {
    // Same module runner as the one Vike uses to load pages (`ssrLoadModule()`) => a module imported by both +serverEntry.js and a page is instantiated only once (like in production)
    await viteServer.ssrLoadModule(serverEntryFilePath)
  } catch (err) {
    console.error(err)
    assertInfo(false, 'Waiting for file changes before restarting server...', { onlyOnce: false })
    restartOnFileChange(viteServer, () => true)
  }
}

function restartOnFileChange(viteServer: ViteDevServer, isRestartNeeded: (filePath: string) => boolean): void {
  const onFileChange = (filePath: string) => {
    filePath = normalizePath(filePath)
    if (isRestartNeeded(filePath)) restart(`${pc.cyan(path.relative(viteServer.config.root, filePath))} changed`)
  }
  viteServer.watcher.on('change', onFileChange)
  viteServer.watcher.on('unlink', onFileChange)
}

function restart(reason: string): never {
  assertInfo(false, `${reason}, restarting server...`, { onlyOnce: false })
  process.exit(EXIT_CODE_RESTART)
}

// Only `$ vike dev` runs +serverEntry.js, not the programmatic API `dev()`: the parent process re-runs the command (process.argv) in the child process
async function getServerEntryFilePath_ifDevCli(): Promise<string | null> {
  if (!isVikeCli()) return null
  const vikeConfig = await getVikeConfigInternal()
  const serverEntryFilePath = getServerEntryFilePath_ifDev(vikeConfig)
  return serverEntryFilePath
}

// Whether one of the modules is +serverEntry.js or (transitively) imported by +serverEntry.js
// - Pages aren't imported by +serverEntry.js: Vike loads them over its own virtual entries => changing a page doesn't restart the server (Vite's HMR handles it)
function isImportedBy(modules: Set<EnvironmentModuleNode> | undefined, serverEntryFilePath: string): boolean {
  const visited = new Set<EnvironmentModuleNode>()
  const stack = [...(modules ?? [])]
  while (stack.length > 0) {
    const mod = stack.pop()!
    if (visited.has(mod)) continue
    visited.add(mod)
    if (mod.file === serverEntryFilePath) return true
    stack.push(...mod.importers)
  }
  return false
}

function getServerEntryViteServer(): ViteDevServer | null {
  return globalObject.viteServer ?? null
}

function isServerChildProcess(): boolean {
  return process.env[IS_SERVER_CHILD_PROCESS] === '1'
}
