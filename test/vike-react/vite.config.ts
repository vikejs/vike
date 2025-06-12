import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { UserConfig } from 'vite'

export default {
  plugins: [react(), vike()],
} satisfies UserConfig
