export { data }

import viteEnvironmentName from 'virtual:environment-name'

async function data(pageContext) {
  const { worker: env } = pageContext.environments
  const worker = await env.config.getWorkerInfo(env.pageContext, 'Worker:')
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
