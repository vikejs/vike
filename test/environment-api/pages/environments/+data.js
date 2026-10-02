export { data }

import viteEnvironmentName from 'virtual:environment-name'

async function data(pageContext) {
  const worker = await pageContext.environments.worker.config.getWorkerInfo(pageContext, 'Worker:')
  return {
    server: {
      viteEnvironmentName,
      hasWorkerConfig: ['getWorkerInfo', 'workerGreeting'].some((name) => name in pageContext.config),
      writtenByWorker: pageContext.writtenByWorker,
      workerGreeting: pageContext.environments.worker.config.workerGreeting,
    },
    worker,
  }
}
