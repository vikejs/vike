export { getWorkerInfo }

import viteEnvironmentName from 'virtual:environment-name'

function getWorkerInfo(pageContext, greetingPrefix) {
  // Shared with the server environment
  pageContext.writtenByWorker = true
  return {
    viteEnvironmentName,
    configNames: Object.keys(pageContext.config).sort(),
    workerGreeting: `${greetingPrefix} ${pageContext.config.workerGreeting}`,
    urlPathname: pageContext.urlPathname,
  }
}
