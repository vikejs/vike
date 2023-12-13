import react from '@vitejs/plugin-react-swc'
import vike from 'vike/plugin'
import { UserConfig } from 'vite'

export default {
  plugins: [vike(), react()]
} as UserConfig
