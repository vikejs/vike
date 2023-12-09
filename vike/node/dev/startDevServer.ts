import { createServer } from 'vite'
import { onSsrHotUpdate } from '../plugin/plugins/serverEntryPlugin.js'

createServer({
  server: {
    middlewareMode: true
  },
  appType: 'custom'
})

onSsrHotUpdate(() => {
  process.exit(33)
})
