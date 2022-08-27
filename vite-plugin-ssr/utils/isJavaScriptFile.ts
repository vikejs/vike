// Also see `./isScriptFile.ts`
export function isJavaScriptFile(filePath: string) {
  // `.mjs`
  // `.cjs`
  // `.js`
  // `.tsx`
  // ...
  return /\.(c|m)?(j|t)sx?$/.test(filePath)
}
