const reactRefresh = require("@vitejs/plugin-react-refresh");
const ssr = require("vite-plugin-ssr/plugin");

const config = {
  plugins: [reactRefresh(), ssr()],
  clearScreen: false,
};

export default config;
