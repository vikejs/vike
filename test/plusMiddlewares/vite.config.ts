import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import type { UserConfig } from 'vite'

export default {
  base: process.env.BASE,
  plugins: [react(), vike()],
} satisfies UserConfig
