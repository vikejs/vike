import reactRefresh from "@vitejs/plugin-react-refresh";
import ssr from "vite-plugin-ssr";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [reactRefresh(), ssr()],
});
