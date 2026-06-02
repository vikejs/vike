import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { cloudflare } from '@cloudflare/vite-plugin'
import { telefunc } from 'telefunc/vite'

export default defineConfig({
  // Ensure a single react-dom instance: avoids React's "Detected multiple renderers concurrently rendering the
  // same context provider" dev warning (https://github.com/vikejs/vike/pull/3106). The warning is benign but, in
  // dev, react-dom/server.edge (imported by react-streaming for the Cloudflare worker) can be loaded as two module
  // instances when Vite's dependency optimizer re-bundles mid-session ("optimized dependencies changed. reloading").
  // Pre-bundling the deps below up front (so no mid-session re-optimization happens) + deduping react keeps it to a
  // single instance.
  // claude --resume 857a23be-c9c2-4f41-91a5-3f524cb884f7
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  environments: {
    ssr: {
      optimizeDeps: {
        include: ['react-dom/server.edge', 'telefunc'],
      },
    },
  },
  plugins: [
    telefunc(),
    react(),
    cloudflare({
      // TO-DO/eventuall: remove this line depending on the outcome of https://github.com/cloudflare/workers-sdk/issues/10120
      viteEnvironment: { name: 'ssr' },
      inspectorPort: false,
    }),
    vike(),
  ],
})
