import { execSync } from 'child_process'
import { infoLog, successLog } from './log.js'

export function commitEjection(commitMessage: string = 'Eject dependencies') {
  infoLog('Committing ejection')
  execSync('git add .')
  execSync(`git commit -m "${commitMessage}"`)
  successLog('Ejection committed with message:', commitMessage)
}

export function isGitInstalled() {
  try {
    execSync('git --version')
    return true
  } catch (error) {
    return false
  }
}

export function isGitHistoryClean() {
  infoLog('Checking git history')
  try {
    execSync('git diff --exit-code')
    return true
  } catch (error) {
    return false
  }
}
