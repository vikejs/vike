import solid from 'vite-plugin-solid'
import ssr from 'vite-plugin-ssr/plugin'
import { UserConfig } from 'vite'

const config: UserConfig = {
  plugins: [solid({ ssr: true }), ssr()],
  build: {
    // @ts-ignore
    polyfillDynamicImport: false
  }
}

export default config
