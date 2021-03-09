import reactRefresh from "@vitejs/plugin-react-refresh";
import ssr from "vite-plugin-ssr";

export default {
  plugins: [reactRefresh(), ssr()],
};
