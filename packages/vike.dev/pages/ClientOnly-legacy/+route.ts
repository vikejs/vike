// We define:
//   pages/ClientOnly-legacy/+Page.mdx
// Instead of:
//   pages/ClientOnly/+Page.mdx
// In order to avoid the error/conflict with pages/clientOnly/+Page.mdx (lower-case **c**) on MacOs and Windows.
// https://github.com/vikejs/vike/issues/1731
export default '/ClientOnly'
