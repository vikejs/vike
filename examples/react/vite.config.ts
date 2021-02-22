import reactRefresh from "@vitejs/plugin-react-refresh";
import mdx from "@brillout/vite-plugin-mdx";
import ssr from "vite-plugin-ssr";
import { UserConfig } from "vite";

const config: UserConfig = {
  plugins: [reactRefresh(), mdx(), ssr()],
  clearScreen: false,
};

export default config;
