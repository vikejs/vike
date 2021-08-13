import reactRefresh from "@vitejs/plugin-react-refresh";
import ssr from "vite-plugin-ssr/plugin";

const isProduction = process.env.NODE_ENV === "production";
const base = isProduction ? "/dist/client/" : "/";

export default {
  plugins: [reactRefresh(), ssr()],
  base,
};
