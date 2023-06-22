export { logWithVitePrefix }
export { logWithVikePrefix }
export { logDirectly }
export { onErrorLog }
export { onLog }

import { assert, projectInfo, type ProjectTag, stripAnsi } from '../../utils'
import pc from '@brillout/picocolors'
import type { LogCategory, LogType } from '../loggerNotProd'

function logWithVikePrefix(msg: string, logType: LogType, category: LogCategory | null, showVikeVersion = false) {
  const projectTag = getProjectTag(showVikeVersion)
  msg = addPrefix(msg, projectTag, category, logType)
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
function logWithVitePrefix(msg: string, logType: LogType, category: LogCategory | null) {
  msg = addPrefix(msg, '[vite]', category, logType)
  logDirectly(msg, logType)
}
function logDirectly(msg: unknown, logType: LogType) {
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
function addPrefix(msg: string, projectTag: '[vite]' | ProjectTag, category: LogCategory | null, logType: LogType) {
  const color = (s: string) => {
    if (logType === 'error' && !hasRed(msg)) return pc.red(pc.bold(s))
    if (logType === 'error-recover' && !hasGreen(msg)) return pc.green(pc.bold(s))
    if (logType === 'warn' && !hasYellow(msg)) return pc.yellow(s)
    if (projectTag === '[vite]') return pc.cyan(pc.bold(s))
    if (projectTag.startsWith(`[${projectInfo.projectName}`)) return pc.magenta(pc.bold(s))
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
