import { telefunc } from 'telefunc/vite'
import react from '@vitejs/plugin-react'
import ssr from 'vike/plugin'

export default {
  plugins: [react(), ssr(), telefunc()]
}
