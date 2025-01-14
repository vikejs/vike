export { dev }

import { prepareApiCall } from './prepareApiCall.js'
import { createServer } from 'vite'
import type { APIOptions } from './types.js'

async function dev(options: APIOptions = {}) {
  const { viteConfigEnhanced } = await prepareApiCall(options.viteConfig, 'dev')
  const server = await createServer(viteConfigEnhanced)
  return server
}
