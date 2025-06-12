import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { UserConfig } from 'vite'

const config: UserConfig = {
  resolve: {
    alias: {
      // We prefix path aliases with '#', see https://vike.dev/path-aliases#vite
      '#root': __dirname,
    },
  },
  plugins: [
    react(),
    vike({
      prerender: true,
    }),
  ],
}

export default config
