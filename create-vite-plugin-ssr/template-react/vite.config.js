const reactRefresh = require("@vitejs/plugin-react-refresh");
const ssr = require("vite-plugin-ssr");

module.exports = {
  plugins: [reactRefresh(), ssr()],
};
