import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import type { UserConfig } from 'vite'

const config: UserConfig = {
  plugins: [react(), vike()],
}

export default config
