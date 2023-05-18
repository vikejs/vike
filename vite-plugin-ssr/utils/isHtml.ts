export { isHtml }

// Copied and adapted from https://stackoverflow.com/questions/15458876/check-if-a-string-is-html-or-not/51325984#51325984
function isHtml(str: string): boolean {
  const re = /(<\/[^<]+>)|(<[^<]+\/>)/
  return re.test(str)
}
