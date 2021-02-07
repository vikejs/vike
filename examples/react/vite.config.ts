import reactRefresh from '@vitejs/plugin-react-refresh'
import mdx from '@brillout/vite-plugin-mdx'
import ssr from 'vite-plugin-ssr'
import { defineConfig } from 'vite'
// import type { UserConfig } from 'vite'

export default defineConfig({
  plugins: [reactRefresh(), mdx(), ssr()],
  optimizeDeps: {
    include: ['vite-plugin-ssr/client', 'react', 'react-dom']
  },
  //@ts-ignore
  ssr: {
    external: ['vite-plugin-ssr']
  },
  clearScreen: false
})
