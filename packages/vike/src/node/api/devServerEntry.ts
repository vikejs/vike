export { startServerEntry_parent }
export { startServerEntry_child }
export { getServerEntryDevCli }
export { getServerEntryViteServer }
export { isServerEntryProcess }

// `$ vike dev` runs +serverEntry.js (if there isn't +server.js) — https://vike.dev/serverEntry
// - The parent process (`$ vike dev`) runs +serverEntry.js in a child process, and restarts the child process whenever a file imported by +serverEntry.js changes.
// - The child process creates Vite's development server (in middleware mode) and runs +serverEntry.js using Vite's module runner.
//   - createDevMiddleware() returns that Vite development server.

import { fork, type ChildProcess } from 'node:child_process'
import path from 'node:path'
import { normalizePath, type EnvironmentModuleNode, type ViteDevServer } from 'vite'
import pc from '@brillout/picocolors'
import { getVikeConfigInternal } from '../vite/shared/resolveVikeConfigInternal.js'
import { getServerEntryDev } from '../vite/plugins/pluginUniversalDeploy/getServerConfig.js'
import { isVikeCli } from '../cli/context.js'
import { assert, assertInfo, assertUsage } from '../../utils/assert.js'
import { getGlobalObject } from '../../utils/getGlobalObject.js'
import { isRunnableDevEnvironment } from '../../utils/isRunnableDevEnvironment.js'
import './assertEnvApiDev.js'

const ENV_VAR = '__VIKE_IS_SERVER_ENTRY_PROCESS'

// The child process exits with this code to tell the parent process to restart it
const EXIT_CODE_RESTART = 33
const globalObject = getGlobalObject<{ viteServer?: ViteDevServer }>('api/devServerEntry.ts', {})

// Parent process — process.fork()
function startServerEntry_parent(): Promise<never> {
  let child: ChildProcess
  let signalReceived: NodeJS.Signals | undefined
  const start = () => {
    const [scriptPath, ...args] = process.argv.slice(1)
    assert(scriptPath)
    child = fork(scriptPath, args, { stdio: 'inherit', env: { ...process.env, [ENV_VAR]: '1' } })
    child.on('exit', (code, signal) => {
      if (code === EXIT_CODE_RESTART && !signalReceived) {
        start()
        return
      }
      signal ??= signalReceived ?? null
      if (signal) {
        // Exit with the same signal as the child process
        process.removeAllListeners(signal)
        process.kill(process.pid, signal)
      } else {
        process.exit(code ?? 1)
      }
    })
  }
  const onSignal = (signal: NodeJS.Signals) => {
    signalReceived = signal
    child.kill(signal)
  }
  process.on('SIGINT', onSignal)
  process.on('SIGTERM', onSignal)
  start()
  // The parent process exits when the child process exits
  return new Promise<never>(() => {})
}

// Child process — vite.ssrLoadModule()
async function startServerEntry_child(viteServer: ViteDevServer, serverEntryFilePath: string): Promise<void> {
  globalObject.viteServer = viteServer
  const ssr = viteServer.environments.ssr
  assertUsage(
    ssr && isRunnableDevEnvironment(ssr),
    `${pc.cyan('$ vike dev')} cannot run +serverEntry.js because Vite's ${pc.cyan('ssr')} environment isn't runnable — see https://vike.dev/serverEntry`,
  )
  let restartOnAnyChange = false
  const restart = (reason: string) => {
    assertInfo(false, `${reason}, restarting server...`, { onlyOnce: false })
    process.exit(EXIT_CODE_RESTART)
  }
  const onFileChange = (filePath: string) => {
    filePath = normalizePath(filePath)
    if (!restartOnAnyChange && !isImportedBy(ssr.moduleGraph.getModulesByFile(filePath), serverEntryFilePath)) return
    restart(`${pc.cyan(path.relative(viteServer.config.root, filePath))} changed`)
  }
  viteServer.watcher.on('change', onFileChange)
  viteServer.watcher.on('unlink', onFileChange)
  // The user's server uses the current Vite development server (e.g. `app.use(devMiddleware)`) => we restart the process instead of letting Vite restart itself (e.g. upon vite.config.js changes)
  viteServer.restart = async () => restart('Vite needs to restart')

  try {
    // Same module runner as the one Vike uses to load pages (`ssrLoadModule()`) => a module imported by both +serverEntry.js and a page is instantiated only once (like in production)
    await viteServer.ssrLoadModule(serverEntryFilePath)
  } catch (err) {
    console.error(err)
    assertInfo(false, 'Waiting for file changes before restarting server...', { onlyOnce: false })
    restartOnAnyChange = true
  }
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

// Only `$ vike dev` runs +serverEntry.js (not the programmatic API `dev()`)
async function getServerEntryDevCli(): Promise<string | null> {
  if (!isVikeCli()) return null
  const vikeConfig = await getVikeConfigInternal()
  return getServerEntryDev(vikeConfig)
}

function getServerEntryViteServer(): ViteDevServer | null {
  return globalObject.viteServer ?? null
}

function isServerEntryProcess(): boolean {
  return process.env[ENV_VAR] === '1'
}
