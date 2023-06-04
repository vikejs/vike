export { isExternalLink }

function isExternalLink(url: string) {
  return !url.startsWith('/') && !url.startsWith('.') && !url.startsWith('?') && url !== ''
}
