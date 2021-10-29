const Miniflare = require("miniflare");

const mf = new Miniflare.Miniflare({
  wranglerConfigPath: "./wrangler.toml",
  scriptPath: './worker/worker/script.js',
});
mf.createServer().listen(3000, () => {
  console.log("Listening on :3000");
});