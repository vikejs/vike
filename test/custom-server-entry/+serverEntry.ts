// https://vike.dev/serverEntry
// This file is the production server entry: it becomes dist/server/index.mjs

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { serve } from 'srvx'
import { staticMiddleware } from 'srvx/static'
import server from 'vike:server'

serve({
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  middleware: [staticMiddleware({ dir: fileURLToPath(new URL('../client', import.meta.url)) })],
  fetch(request) {
    if (new URL(request.url).pathname === '/health') return new Response('OK from +serverEntry.ts')
    // +server.ts exports
    return server.fetch(request)
  },
  // Like @universal-deploy/node (srvx logs to stderr upon graceful shutdown)
  gracefulShutdown: false,
})

// Used by test-preview.test.ts to check that pre-rendering doesn't execute this file
fs.appendFileSync(path.join(process.cwd(), 'dist/server/executed.log'), 'executed\n')

// Side exports are preserved in dist/server/index.mjs
export const MY_EXPORT = 'MY_EXPORT'
