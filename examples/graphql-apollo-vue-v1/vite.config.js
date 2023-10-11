import vue from '@vitejs/plugin-vue'
import vike from 'vike/plugin'

export default {
  plugins: [vue(), vike()],
  ssr: {
    noExternal: ['@apollo/client', '@vue/apollo-composable']
  }
}
