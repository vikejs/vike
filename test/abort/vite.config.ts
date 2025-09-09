import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import type { UserConfig } from 'vite'

export default {
  plugins: [vike(), react()],
  // Simulate the real-world config users get (in this monorepo Vike is linked thus ssr.noExternal which isn't what users get)
  ssr: { external: ['vike'] },
  // Inspect
  build: { minify: false },
} satisfies UserConfig
