import { dev } from 'vike/api'
console.log('Starting dev server...')
const { viteConfig } = await dev()
const { port } = viteConfig.server
console.log(`Server running at http://localhost:${port}`)
