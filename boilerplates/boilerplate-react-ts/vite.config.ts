import reactRefresh from "@vitejs/plugin-react-refresh";
import ssr from "vite-plugin-ssr/plugin";
import { UserConfig } from "vite";

const config: UserConfig = {
  plugins: [reactRefresh(), ssr()],
};

export default config;
