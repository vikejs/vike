export { data }

import viteEnvironmentName from 'virtual:environment-name'

async function data(pageContext) {
  const worker = await pageContext.config.getWorkerInfo(pageContext, 'Worker:')
  return {
    server: {
      viteEnvironmentName,
      hasWorkerConfig: 'workerGreeting' in pageContext.config || 'workerSuffixed' in pageContext.config,
      writtenByWorker: pageContext.writtenByWorker,
      workerGreeting: pageContext.environments.worker.config.workerGreeting,
      workerInfoEnvironment: (await pageContext.environments.worker.config.getWorkerInfo(pageContext, ''))
        .viteEnvironmentName,
    },
    worker,
  }
}
