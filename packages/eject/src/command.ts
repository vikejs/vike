import { config } from './config.js'
import { commitEjection, isGitHistoryClean, isGitInstalled } from './git.js'
import { errorLog, infoLog, warnLog } from './log.js'
import { copyDependency, install, updatePackageJson } from './system.js'

export function eject(dependencies: string[], options: { force: boolean }) {
  if (!options.force && !isGitInstalled()) {
    warnLog('Git is not installed, please install git or use --force to bypass git check')
    return
  }

  if (!options.force && !isGitHistoryClean()) {
    warnLog('Please commit your changes before ejecting dependencies or use --force to bypass git history')
    return
  }
  const successFullEjections = []
  for (const dependency of dependencies) {
    try {
      copyDependency(dependency)
      successFullEjections.push(dependency)
    } catch (error) {
      errorLog('Error ejecting dependency:', dependency)
    }
  }
  console.log('Ejected dependencies:', successFullEjections)
  if (successFullEjections.length > 0) {
    updatePackageJson(successFullEjections)
    infoLog('We updated your package.json and linked the dependencies to the ejected folder')
    infoLog('finalize the ejection by running install')
    install()
    commitEjection(config.COMMIT_MESSAGE)
  } else {
    warnLog('No dependencies ejected')
  }
}
