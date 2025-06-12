import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'

export default {
  base: '/some/base-url',
  plugins: [react(), vike()],
}
