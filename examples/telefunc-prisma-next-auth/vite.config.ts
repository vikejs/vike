import react from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'
import telefunc from 'telefunc/vite'
import { UserConfig } from 'vite'

const config: UserConfig = {
  plugins: [react(), ssr(), telefunc()],
  clearScreen: false,
  define: {
     // next-auth needs process.env to be defined in frontend
    'process.env': process.env,
  },
}

export default config
