import solid from 'vite-plugin-solid'
import ssr from 'vike/plugin'
import { UserConfig } from 'vite'

const config: UserConfig = {
  plugins: [solid({ ssr: true }), ssr()]
}

export default config
