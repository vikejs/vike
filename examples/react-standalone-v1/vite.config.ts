import { telefunc } from 'telefunc/vite'
import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'

export default {
  plugins: [react(), vike({ server: { entry: './server/index.ts', reload: 'fast' }, standalone: true }), telefunc()]
}
