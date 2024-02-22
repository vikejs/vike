// TODO: ConfigGlobal/VikeConfig
import type { Config } from 'vike/types'

import vikeNode from 'vike-node/config'

export default {
  extends: [vikeNode],
  server: { entry: { index: './server/index-fastify.ts', worker: './server/worker.mjs' }, standalone: true }
} satisfies Config
