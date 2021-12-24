// Webpack v4 doesn't seem to support `package.json#exports`.
// So we need this file to help Cloudflare Workers' webpack v4 bundler resolve `vite-plugin-ssr/cli`.
module.exports = require('./dist/cjs/node/cli/index.js')
/* ESM doesn't work; it breaks `require(pluginManifestPath)`
export { prerender } from './dist/esm/node/cli/index.js';
*/
