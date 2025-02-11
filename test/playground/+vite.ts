import react from '@vitejs/plugin-react'
import type { UserConfig } from 'vite'

export default {
  // TEST: use +vite to add Vite plugin
  plugins: [react()]
} satisfies UserConfig
