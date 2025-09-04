import { dev } from 'vike/api'
console.log('Starting dev server...')
const { viteConfig, viteServer } = await dev()
await viteServer.listen()
viteServer.printUrls()
viteServer.bindCLIShortcuts({ print: true })
const { port } = viteConfig.server
console.log(`Server running at http://localhost:${port}`)

import { assertGlobalContext } from './common.js'
await assertGlobalContext()
