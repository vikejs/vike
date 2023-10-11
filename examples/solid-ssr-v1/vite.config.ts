import solid from 'vite-plugin-solid'
import vike from 'vike/plugin'
import { UserConfig } from 'vite'

const config: UserConfig = {
  plugins: [solid({ ssr: true }), vike()]
}

export default config
