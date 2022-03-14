import react from "@vitejs/plugin-react";
import ssr from "vite-plugin-ssr/plugin";
import { UserConfig } from 'vite'

export default {
  plugins: [
    react(),
    ssr({
      pageFiles: {
        include: ["framework"],
      },
    }),
  ],
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
} as UserConfig;
