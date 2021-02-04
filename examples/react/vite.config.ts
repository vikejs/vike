import reactRefresh from '@vitejs/plugin-react-refresh'
// import { ssrPlugin } from "vite-plugin-ssr";
import mdx from '@brillout/vite-plugin-mdx'
import { defineConfig } from 'vite'
// import type { UserConfig } from 'vite'

export default defineConfig({
  plugins: [
    reactRefresh(),
    mdx()
    // ssrPlugin(),
  ],
  optimizeDeps: {
    include: ['vite-plugin-ssr/client', 'react', 'react-dom']
  },
  clearScreen: false
})
