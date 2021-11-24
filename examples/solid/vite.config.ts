import solidPlugin from 'vite-plugin-solid'
import ssr from 'vite-plugin-ssr/plugin'
import { UserConfig } from 'vite'

const config: UserConfig = {
  plugins: [solidPlugin({ ssr: true }), ssr()],
  build: {
    polyfillDynamicImport: false,
  },
}

export default config
