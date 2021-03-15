import reactRefresh from "@vitejs/plugin-react-refresh";
import mdx from "vite-plugin-mdx";
import ssr from "vite-plugin-ssr/plugin";
import { UserConfig } from "vite";

const config: UserConfig = {
  plugins: [reactRefresh(), mdx(), ssr()],
  optimizeDeps: { include: ["@mdx-js/react"] },
  clearScreen: false,
};

export default config;
