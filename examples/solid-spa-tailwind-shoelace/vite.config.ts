import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import ssr from "vite-plugin-ssr/plugin";

export default defineConfig({
  plugins: [solidPlugin({ ssr: true }), ssr()],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
});
