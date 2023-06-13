export { logWithVitePrefix }
export { logWithVikePrefix }
export { log as logWithoutPrefix }
export { onErrorLog }
export { onLog }

import { assert, projectInfo } from '../../utils'
import pc from '@brillout/picocolors'
import type { LogCategory, LogType } from '../loggerNotProd'

function logWithVikePrefix(msg: string, logType: LogType, category: LogCategory | null) {
  msg = addPrefix(msg, projectInfo.projectName, category, logType)
  log(msg, logType)
}
function logWithVitePrefix(msg: string, logType: LogType, category: LogCategory | null) {
  msg = addPrefix(msg, 'vite', category, logType)
  log(msg, logType)
}
function log(msg: unknown, logType: LogType) {
  assert(onLogCallback)
  onLogCallback()
  if (logType === 'info') {
    console.log(msg)
  } else if (logType === 'warn') {
    console.warn(msg)
  } else if (logType === 'error') {
    assert(onErrorLogCallback)
    onErrorLogCallback()
    console.error(msg)
  } else if (logType === 'error-recover') {
    // stderr because user will most likely want to know about error recovering
    console.error(msg)
  } else {
    assert(false)
  }
}

let onErrorLogCallback: (() => void) | undefined
function onErrorLog(cb: () => void) {
  onErrorLogCallback = cb
}
let onLogCallback: (() => void) | undefined
function onLog(cb: () => void) {
  onLogCallback = cb
}
function addPrefix(msg: string, project: 'vite' | 'vite-plugin-ssr', category: LogCategory | null, logType: LogType) {
  const color = (s: string) => {
    if (logType === 'error' && !hasRed(msg)) return pc.red(s)
    if (logType === 'error-recover' && !hasGreen(msg)) return pc.green(s)
    if (logType === 'warn' && !hasYellow(msg)) return pc.yellow(s)
    if (project === 'vite-plugin-ssr') return pc.yellow(s)
    if (project === 'vite') return pc.cyan(s)
    assert(false)
  }
  let tag = color(pc.bold(`[${project}]`))
  if (category) {
    tag = tag + pc.dim(`[${category}]`)
  }

  const timestamp = pc.dim(new Date().toLocaleTimeString())

  return `${timestamp} ${tag} ${msg}`
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
  return str.includes('\x1b[31m')
}
