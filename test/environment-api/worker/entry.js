export { getWorkerInfo }

import { environmentName, viteEnvironmentName, loadPageConfig } from 'vike/runtime'

async function getWorkerInfo(pageId) {
  const { config } = await loadPageConfig(pageId)
  return {
    environmentName,
    viteEnvironmentName,
    configNames: Object.keys(config).sort(),
    workerGreeting: config.workerGreeting,
    workerSuffixed: config.workerSuffixed,
  }
}
