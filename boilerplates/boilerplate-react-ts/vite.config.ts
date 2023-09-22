import react from '@vitejs/plugin-react'
import ssr from 'vike/plugin'
import { UserConfig } from 'vite'

const config: UserConfig = {
  plugins: [react(), ssr()]
}

export default config
