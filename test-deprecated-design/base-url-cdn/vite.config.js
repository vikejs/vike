import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'

export default {
  plugins: [
    react(),
    vike({
      baseAssets: 'http://localhost:8080/cdn/',
    }),
  ],
}
