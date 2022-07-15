// All possible JavaScript file extensions as Glob Pattern.
//  - Needs to work with Micromatch: https://github.com/micromatch/micromatch because:
//    - Vite's `import.meta.glob()` uses Micromatch
//  - We need this to be a whitelist because:
//   - A pattern `*([a-zA-Z0-9]` doesn't work.
//     - Because of ReScript: `.res` are ReScript source files which need to be ignored. (The ReScript compiler generates `.js` files alongside `.res` files.)
//   - Black listing doesn't work.
//     - We cannot implement a blacklist with a glob pattern.
//     - A post `import.meta.glob()` blacklist filtering doesn't work because Vite would still process the files (e.g. including them in the bundle).
export const javascriptFileExtensions = '(js|cjs|mjs|ts|cts|mts|jsx|cjsx|mjsx|tsx|ctsx|mtsx|vue|svelte|marko|md|mdx)'
export { isJavascriptFile }

function isJavascriptFile(file: string) {
  const extensionList = parseGlob(javascriptFileExtensions)
  return extensionList.some((ext) => file.endsWith('.' + ext))
}
function parseGlob(pattern: string) {
  return pattern.slice(1, -1).split('|')
}
