import react from '@vitejs/plugin-react-swc'
import mdx from '@mdx-js/rollup'
import vike from 'vike/plugin'
import { UserConfig } from 'vite'

const root = __dirname

export default {
  build: {
    outDir: `${root}/../../examples/react-full-v1/dist/nested`
  },
  plugins: [
    vike({
      prerender: true
    }),
    mdx(),
    react()
  ]
} as UserConfig
