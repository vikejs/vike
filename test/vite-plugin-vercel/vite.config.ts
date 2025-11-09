import react from '@vitejs/plugin-react-swc'
import vike from 'vike/plugin'
import type { UserConfig } from 'vite'
import vercel from 'vite-plugin-vercel'

export default {
  plugins: [
    react(),
    vike(),
    vercel({
      // You usually want the server to handle all routes
      source: '/.*',
    }),
  ],
  vercel: {
    additionalEndpoints: [
      {
        // entry file to the server. Default export must be a node server or a function
        source: 'express-entry.ts',
        // replaces default Vike target
        destination: 'ssr_',
        // already added by default Vike route
        route: false,
      },
    ],
  },
} as UserConfig
