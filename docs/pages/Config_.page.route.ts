// Case-insensitive filesystem can't cope with:
//  - pages/Config.page.server.mdx
//  - pages/config.page.server.mdx
// See https://github.com/vikejs/vike/issues/850
export default '/Config'
