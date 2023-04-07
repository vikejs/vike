import solid from 'vite-plugin-solid'
import ssr from 'vite-plugin-ssr/plugin'
import { UserConfig } from 'vite'
import devtools from 'solid-devtools/vite'

const config: UserConfig = {
  plugins: [
    devtools({
      /* additional options */
      autoname: true // e.g. enable autoname
    }),
    solid({ ssr: true }),
    ssr()
  ],
  build: {
    // @ts-ignore
    polyfillDynamicImport: false
  }
}

export default config
