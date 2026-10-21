export { data }

import viteEnvironmentName from 'virtual:environment-name'

async function data(pageContext) {
  const { worker: workerEnvironment } = pageContext.environments
  const worker = await workerEnvironment.config.getWorkerInfo(workerEnvironment.pageContext, 'Worker:')
  return {
    server: {
      viteEnvironmentName,
      hasWorkerConfig: ['getWorkerInfo', 'workerGreeting'].some((name) => name in pageContext.config),
      writtenByWorker: pageContext.writtenByWorker,
      workerGreeting: workerEnvironment.config.workerGreeting,
    },
    worker,
  }
}
