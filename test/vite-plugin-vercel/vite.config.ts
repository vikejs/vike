import react from '@vitejs/plugin-react-swc'
import vike from 'vike/plugin'
import type { UserConfig } from 'vite'
import { vercel } from 'vite-plugin-vercel/vite'

export default {
  plugins: [react(), vike(), vercel()],
} as UserConfig
