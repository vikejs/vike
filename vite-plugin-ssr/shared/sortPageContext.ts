export { sortPageContext }

// Sort `pageContext` keys alphabetically, in order to make reading `console.log(pageContext)` easier

function sortPageContext(pageContext: Record<string, unknown>): void {
  const entries = Object.entries(pageContext)
  for (const key in pageContext) {
    delete pageContext[key]
  }
  entries
    .sort(([key1], [key2]) => compareString(key1, key2))
    .forEach(([key, val]) => {
      pageContext[key] = val
    })
}
function compareString(str1: string, str2: string): number {
  if (str1.toLowerCase() < str2.toLowerCase()) return -1
  if (str1.toLowerCase() > str2.toLowerCase()) return 1
  return 0
}
