import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { cloudflare } from '@cloudflare/vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    cloudflare({
      // TODO/now: create GitHub issue to track progress on this
      viteEnvironment: { name: 'ssr' },
    }),
    vike(),
  ],
  /*
  ssr: {
    external: [
      '@brillout/vite-plugin-server-entry',
      '@brillout/vite-plugin-server-entry/runtime',
      '@brillout/vite-plugin-server-entry/plugin',
    ]
  },
  */
  optimizeDeps: {
    exclude: [
      'vike',
      'vike/server',
      '@brillout/vite-plugin-server-entry',
      '@brillout/vite-plugin-server-entry/runtime',
      '@brillout/vite-plugin-server-entry/plugin',
      '../../../../../../../../../examples/react-full/dist/server/entry.mjs',
    ],
  },
})
