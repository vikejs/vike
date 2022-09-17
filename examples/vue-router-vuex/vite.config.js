import vue from '@vitejs/plugin-vue'
import ssr from 'vite-plugin-ssr/plugin'
import { fileURLToPath, URL } from "url";

export default {
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./pages", import.meta.url)),
      "cpnt": fileURLToPath(new URL("./components", import.meta.url)),
    }
  },
  plugins: [vue(), ssr()]
}
