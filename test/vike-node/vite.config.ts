import react from '@vitejs/plugin-react'
import { telefunc } from 'telefunc/vite'
import vike from 'vike/plugin'

export default {
  plugins: [react(), vike(), telefunc()]
}
