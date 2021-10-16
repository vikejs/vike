import react from "@vitejs/plugin-react";
import ssr from "vite-plugin-ssr/plugin";

const isProduction = process.env.NODE_ENV === "production";
const base = isProduction ? "/dist/client/" : "/";

export default {
  plugins: [react(), ssr()],
  base,
};
