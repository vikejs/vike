// Unit tests at ./isHtml.spec.ts

export { isHtml }

function isHtml(str: string): boolean {
  // Copied and adapted from https://stackoverflow.com/questions/15458876/check-if-a-string-is-html-or-not/51325984#51325984
  const re = /(<\/[^<]+>)|(<[^<]+\/>)/
  return re.test(str)
}
