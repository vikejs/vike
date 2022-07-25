import vue from '@vitejs/plugin-vue'
import ssr from 'vite-plugin-ssr/plugin'

export default {
  plugins: [vue(), ssr()],
  ssr: {
    noExternal: ['@apollo/client', '@vue/apollo-composable'],
  },
}
