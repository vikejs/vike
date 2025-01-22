import { build, preview } from 'vike/api'
await build()
console.log('Starting preview server...')
const { viteConfig } = await preview()
const { port } = viteConfig.preview
console.log(`Server running at http://localhost:${port}`)
