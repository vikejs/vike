// Vite uses micromatch: https://github.com/micromatch/micromatch
// Pattern is an Extglob: https://github.com/micromatch/micromatch#extglobs
// We need this to be a whitelist because:
//   - A pattern `*([a-zA-Z0-9]` doesn't work for ReScript (`.res` are ReScript source files; the ReScript compiler generates `.js` files alongside `.res` files.)
//   - A post `import.meta.glob()` blacklist filtering doesn't work because Vite would still process the files (e.g. including them in the bundle).
export const pageFileExtensionExtGlob = '(js|ts|jsx|tsx|cjs|cts|cjsx|ctsx|mjs|mts|mjsx|mtsx|vue|svelte|marko|md|mdx)'
