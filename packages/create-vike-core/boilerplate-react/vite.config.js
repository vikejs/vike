import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'

export default {
  plugins: [react(), vike()],
  server: {
    port: 5001,
  },
  preview: {
    port: 5002,
  },
}
