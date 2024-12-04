export { getEditLink }

function getEditLink(path?: string) {
  return `https://github.com/vikejs/vike/blob/main/docs/pages${path}/%2BPage.mdx?plain=1`
}
