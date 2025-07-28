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
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: 'TTTTTTTT',
          setup(build) {
            // https://github.com/brillout/esbuild-playground
            build.onResolve({ filter: /.*/ }, async ({ path }) => {
              console.log(path)
              if (!path.includes('vite-plugin-server-entry')) return
              return { path, external: true }
            })
          },
        },
      ],
    },
  },
})
