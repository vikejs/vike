export { config }

import vikeReact from 'vike-react/config'
import { Layout } from './Layout'

const config = {
  // https://vike.dev/Layout
  Layout: Layout,
  // https://vike.dev/extends
  extends: vikeReact,
  // https://vike.dev/meta
  meta: {
    // - The environment `worker` is introduced only by meta.effect()
    enableWorker: {
      env: { config: true },
      effect: ({ configValue }) =>
        configValue && { meta: { workerGreeting: { env: { server: false, client: false, worker: true } } } },
    },
    workerGreeting: {
      env: { server: true },
    },
    // - Called by +data.js (server environment), runs in the worker environment
    getWorkerInfo: {
      env: { worker: true },
    },
  },
  enableWorker: true,
  workerGreeting: 'Hello from the worker environment',
}
