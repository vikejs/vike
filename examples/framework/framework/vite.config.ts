import react from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'
import { UserConfig } from 'vite'
// @ts-ignore
import { rootApp } from './utils/rootApp.mjs'

export default {
  root: rootApp,
  plugins: [
    react(),
    ssr({
      pageFiles: {
        include: ['framework'],
      },
    }),
  ],
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
} as UserConfig
