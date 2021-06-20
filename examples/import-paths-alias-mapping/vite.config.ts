import reactRefresh from "@vitejs/plugin-react-refresh";
import ssr from "vite-plugin-ssr/plugin";
import { UserConfig } from "vite";

const config: UserConfig = {
  resolve: {
    alias: {
      "~": __dirname,
    },
  },
  plugins: [reactRefresh(), ssr()],
};

export default config;
