import { build, preview } from 'vike/api'
import assert from 'node:assert'
await build()
if (process.env.BUILD_TWICE) await build()
assert(globalThis.prerenderContextWasTested)
console.log('Starting preview server...')
const { viteConfig } = await preview()
const { port } = viteConfig.preview
console.log(`Server running at http://localhost:${port}`)

import { assertGlobalContext } from './common.js'
await assertGlobalContext()
