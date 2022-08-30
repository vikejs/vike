import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import ssr from "vite-plugin-ssr/plugin";

export default defineConfig({
  plugins: [solidPlugin({ ssr: true }), ssr()],
  build: {
    target: "esnext",
  },
});
