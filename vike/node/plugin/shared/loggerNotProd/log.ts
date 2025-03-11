export { logWithViteTag }
export { logWithVikeTag }
export { logDirectly }
export { applyViteSourceMapToStackTrace }

import { assert, projectInfo, stripAnsi, hasProp, assertIsNotProductionRuntime, PROJECT_VERSION } from '../../utils.js'
import pc from '@brillout/picocolors'
import { isErrorDebug } from '../../../shared/isErrorDebug.js'
import { getViteDevServer } from '../../../runtime/globalContext.js'
import type { LogCategory, LogType } from '../loggerNotProd.js'

assertIsNotProductionRuntime()

type ProjectTag = `[vike]` | `[vike@${typeof PROJECT_VERSION}]`

function logWithVikeTag(msg: string, logType: LogType, category: LogCategory | null, showVikeVersion = false) {
  const projectTag = getProjectTag(showVikeVersion)
  msg = prependTags(msg, projectTag, category, logType)
  logDirectly(msg, logType)
}
function getProjectTag(showVikeVersion: boolean) {
  let projectTag: ProjectTag
  if (showVikeVersion) {
    projectTag = `[vike@${PROJECT_VERSION}]`
  } else {
    projectTag = `[vike]`
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

  if (logType === 'info') {
    console.log(thing)
    return
  }
  if (logType === 'warn') {
    console.warn(thing)
    return
  }
  if (logType === 'error') {
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
    if (logType === 'error' && !hasRed(msg)) return pc.bold(pc.red(s))
    if (logType === 'error-recover' && !hasGreen(msg)) return pc.bold(pc.green(s))
    if (logType === 'warn' && !hasYellow(msg)) return pc.yellow(s)
    if (projectTag === '[vite]') return pc.bold(pc.cyan(s))
    if (projectTag.startsWith(`[vike`)) return pc.bold(pc.cyan(s))
    assert(false)
  }
  let tag = color(`${projectTag}`)
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
