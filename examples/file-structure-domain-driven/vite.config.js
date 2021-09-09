import reactRefresh from "@vitejs/plugin-react-refresh";
import ssr from "vite-plugin-ssr/plugin";

export default {
  plugins: [reactRefresh(), ssr()],
};
