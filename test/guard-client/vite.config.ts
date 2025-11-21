import { defineConfig } from 'vite'
import vike from 'vike/plugin'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), vike({ prerender: true })],
})
