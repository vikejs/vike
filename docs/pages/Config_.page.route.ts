// Case-insensitive filesystem can't cope with:
//  - pages/Config.page.server.mdx
//  - pages/config.page.server.mdx
// See https://github.com/brillout/vite-plugin-ssr/issues/850
export default '/Config'
