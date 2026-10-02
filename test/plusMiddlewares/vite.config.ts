import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import type { Connect, Plugin, UserConfig } from 'vite'

// Like Telefunc's Vite plugin: +middleware should run before its middleware
const addPostMiddleware = (server: { middlewares: Connect.Server }) => () => {
  server.middlewares.use('/middleware', (_req, res) => res.end('Answered by an `enforce: post` Vite plugin'))
}
const postPlugin: Plugin = {
  name: 'test:post-middleware',
  enforce: 'post',
  configureServer: addPostMiddleware,
  configurePreviewServer: addPostMiddleware,
}

export default {
  plugins: [react(), vike(), postPlugin],
} satisfies UserConfig
