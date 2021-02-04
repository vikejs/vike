import {
  isAbsolute as pathIsAbsolute,
  dirname as pathDirname,
  sep as pathSep
} from 'path'
import { findUp } from './findUp'
import { assert } from './assert'
import getCallsites from 'callsites'

export { findRootDir }

// We get the callstack now to make sure we don't get the callstack of an event loop
const callstack = getCallstack()

/**
 * Find the user's project root directory
 */
async function findRootDir(): Promise<string | null> {
  const firstUserFile = getFirstUserFile()
  if (!firstUserFile) return null
  assert(pathIsAbsolute(firstUserFile))

  const packageJsonFile = await findUp(
    'package.json',
    pathDirname(firstUserFile)
  )

  if (!packageJsonFile) {
    return null
  }

  const userRootDir = pathDirname(packageJsonFile)
  return userRootDir
}

function getFirstUserFile() {
  const userScripts = getUserFiles()
  // const userScript = userScripts.slice(-1)[0] || null;
  const userScript = userScripts[0] || null
  return userScript
}
/*
function getLastUserFile() {
  const userScripts = getUserFiles();
  const userScript = userScripts.slice(-1)[0] || null;
  return userScript;
}
*/
function getUserFiles() {
  const userScripts = []
  for (let i = 0; i < callstack.length; i++) {
    const filePath = callstack[i]
    if (isNodeModules(filePath)) {
      continue
    }
    if (isTsNodeDev(filePath)) {
      continue
    }
    userScripts.push(filePath)
  }
  return userScripts
}
function isNodeModules(filePath: string) {
  // Whether `filePath` contains `node_modules`
  return filePath.split(pathSep).includes('node_modules')
}
function isTsNodeDev(filePath: string) {
  /* ts-node-dev seems to first run ts-node-dev code,
   * leading to call stacks like this:
   *  [
   *   '/tmp/ts-node-dev-hook-9277274223384615.js',
   *   '/tmp/ts-node-dev-hook-9277274223384615.js',
   *    ...
   * ]
   */
  return filePath.includes('ts-node-dev-hook')
}

function getCallstack() {
  const callsites = getAllCallsites()

  const callstack = []
  for (let i = callsites.length - 1; i >= 0; i--) {
    const callsite = callsites[i]
    if (callsite.isNative()) {
      continue
    }
    const filePath = callsite.getFileName()
    if (!filePath) {
      continue
    }
    if (isNodejsSourceFile(filePath)) {
      continue
    }
    callstack.push(filePath)
  }

  return callstack
}
function isNodejsSourceFile(filePath: string) {
  return !pathIsAbsolute(filePath)
}
function getAllCallsites() {
  const stackTraceLimit__original = Error.stackTraceLimit
  Error.stackTraceLimit = Infinity
  const callsites = getCallsites()
  Error.stackTraceLimit = stackTraceLimit__original
  return callsites
}
