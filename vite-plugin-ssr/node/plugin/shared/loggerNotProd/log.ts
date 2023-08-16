export { logWithViteTag }
export { logWithVikeTag }
export { logDirectly }
export { isFirstLog }
export { clearScreen }
export { screenHasErrors }

import { assert, projectInfo, type ProjectTag, stripAnsi, hasProp, assertIsNotProductionRuntime } from '../../utils.js'
import pc from '@brillout/picocolors'
import { isErrorDebug } from '../isErrorDebug.js'
import { getViteDevServer } from '../../../runtime/globalContext.js'
import type { LogCategory, LogType } from '../loggerNotProd.js'
import type { ResolvedConfig } from 'vite'

assertIsNotProductionRuntime()

let isFirstLog = true
let screenHasErrors = false

function logWithVikeTag(msg: string, logType: LogType, category: LogCategory | null, showVikeVersion = false) {
  const projectTag = getProjectTag(showVikeVersion)
  msg = prependTags(msg, projectTag, category, logType)
  logDirectly(msg, logType)
}
function getProjectTag(showVikeVersion: boolean) {
  let projectTag: ProjectTag
  if (showVikeVersion) {
    projectTag = `[${projectInfo.projectName}@${projectInfo.projectVersion}]`
  } else {
    projectTag = `[${projectInfo.projectName}]`
  }
  return projectTag
}
function logWithViteTag(msg: string, logType: LogType, category: LogCategory | null) {
  msg = prependTags(msg, '[vite]', category, logType)
  logDirectly(msg, logType)
}

// Not production => every log is triggered by logDirectly()
//  - Even all Vite logs also go through logDirectly() (see interceptors of loggerVite.ts)
//  - Production => logs aren't managed by loggerNotProd.ts => logDirectly() is never called (not even loaded as asserted by assertIsVitePluginCode())
function logDirectly(thing: unknown, logType: LogType) {
  applyViteSourceMapToStackTrace(thing)

  isFirstLog = false

  if (logType === 'info') {
    console.log(thing)
    return
  }
  if (logType === 'warn') {
    console.warn(thing)
    return
  }
  if (logType === 'error') {
    screenHasErrors = true
    console.error(thing)
    return
  }
  if (logType === 'error-recover') {
    // stderr because user will most likely want to know about error recovering
    console.error(thing)
    return
  }

  assert(false)
}

function clearScreen(viteConfig: ResolvedConfig) {
  // We use Vite's logger in order to respect the user's `clearScreen: false` setting
  viteConfig.logger.clearScreen('error')
  screenHasErrors = false
}

function applyViteSourceMapToStackTrace(thing: unknown) {
  if (isErrorDebug()) return
  if (!hasProp(thing, 'stack')) return
  const viteDevServer = getViteDevServer()
  if (!viteDevServer) return
  // Apply Vite's source maps
  viteDevServer.ssrFixStacktrace(thing as Error)
}

function prependTags(msg: string, projectTag: '[vite]' | ProjectTag, category: LogCategory | null, logType: LogType) {
  const color = (s: string) => {
    if (logType === 'error' && !hasRed(msg)) return pc.red(pc.bold(s))
    if (logType === 'error-recover' && !hasGreen(msg)) return pc.green(pc.bold(s))
    if (logType === 'warn' && !hasYellow(msg)) return pc.yellow(s)
    if (projectTag === '[vite]') return pc.cyan(pc.bold(s))
    if (projectTag.startsWith(`[${projectInfo.projectName}`)) return pc.cyan(pc.bold(s))
    assert(false)
  }
  let tag = color(pc.bold(`${projectTag}`))
  if (category) {
    tag = tag + pc.dim(`[${category}]`)
  }

  const timestamp = pc.dim(new Date().toLocaleTimeString())

  const whitespace = /\s|\[/.test(stripAnsi(msg)[0]!) ? '' : ' '

  return `${timestamp} ${tag}${whitespace}${msg}`
}
function hasRed(str: string): boolean {
  // https://github.com/brillout/picocolors/blob/e291f2a3e3251a7f218ab6369ae94434d85d0eb0/picocolors.js#L57
  return str.includes('\x1b[31m')
}
function hasGreen(str: string): boolean {
  // https://github.com/brillout/picocolors/blob/e291f2a3e3251a7f218ab6369ae94434d85d0eb0/picocolors.js#L58
  return str.includes('\x1b[32m')
}
function hasYellow(str: string): boolean {
  // https://github.com/brillout/picocolors/blob/e291f2a3e3251a7f218ab6369ae94434d85d0eb0/picocolors.js#L59
  return str.includes('\x1b[33m')
}
