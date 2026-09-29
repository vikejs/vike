export { getWorkerInfo }

import { environmentName, viteEnvironmentName, loadPageConfig } from 'vike/runtime'
import { environmentName as environmentNameOfDependency } from 'vike-runtime-dep'

async function getWorkerInfo(pageId) {
  const { config } = await loadPageConfig(pageId)
  return {
    environmentName,
    environmentNameOfDependency,
    viteEnvironmentName,
    configNames: Object.keys(config).sort(),
    workerGreeting: config.workerGreeting,
    workerSuffixed: config.workerSuffixed,
  }
}
