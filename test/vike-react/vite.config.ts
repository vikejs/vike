import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { UserConfig } from 'vite'

export default {
  plugins: [react(), vike()],
  server: { port: 3000 },
  preview: { port: 3000 }
} satisfies UserConfig
