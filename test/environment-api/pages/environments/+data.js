export { data }

import { environmentName, viteEnvironmentName, loadPageConfig } from 'vike/runtime'
import { loadWorker } from 'virtual:load-worker'

async function data(pageContext) {
  const { config } = await loadPageConfig(pageContext.pageId)
  const { getWorkerInfo } = await loadWorker()
  return {
    server: {
      environmentName,
      viteEnvironmentName,
      hasPage: typeof config.Page === 'function',
      hasWorkerConfig: 'workerGreeting' in config || 'workerSuffixed' in config,
    },
    worker: await getWorkerInfo(pageContext.pageId),
  }
}
