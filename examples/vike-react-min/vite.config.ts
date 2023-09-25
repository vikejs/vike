import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import type { UserConfig } from 'vite'

export default {
  plugins: [
    // @ts-ignore Not sure why TypeScript isn't resolving `react` to the default export of @vitejs/plugin-react
    react(),
    vike()
  ]
} satisfies UserConfig
